import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../../users/user-role.enum";

export class AuthCredentialsDto {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    fullName: string;

    @IsString()
    address: string;

    @IsString()
    contact: string;

    @IsEnum(UserRole)
    userRole: UserRole;

    @IsString()
    @MinLength(8)
    @MaxLength(40)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password is too weak',
    })
    password: string;
}