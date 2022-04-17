import { EntityRepository, getManager, Repository } from "typeorm";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { Logger } from "@nestjs/common";
import { Cart } from "../cart/cart.entity";
import { ConflictError, InternalServerError } from "helpers/custom-errors";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    private logger = new Logger(UsersRepository.name)

    async createUser(authCredentialsDto: AuthCredentialsDto) {
        const manager = getManager();
        const { email, fullName, password, userRole, address, contact } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({
            address,
            contact,
            email,
            fullName,
            password: hashedPassword,
            userRole
        });

        try {
            const savedUser =  await this.save(user);

            const cart = new Cart();
            cart.user = savedUser;
            await manager.save(Cart, cart);
            this.logger.log('User successfully created');
        } catch(error) {
            if (error.code === '23505') {
                throw new ConflictError('Email already exists');
            } else {
                throw new InternalServerError('There was a problem with the server');
                
            }
        }
    }
}