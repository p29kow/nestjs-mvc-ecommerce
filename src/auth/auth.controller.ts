import { Body, Controller, Get, Post, Render, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginGuard } from './login.guard';
import { SignInFilter } from '../common/filters/signin.filter';
import { HomeGuard } from '../main/main.guard';
import { UseInterceptors } from '@nestjs/common';
import { DuplicateEmailInterceptor } from '../common/interceptors/duplicate-mail.interceptor';
import { DuplicateEmailFilter } from '../common/filters/duplicate-email.filter';

@Controller('auth')

export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(HomeGuard)
    @Get('register') 
    @Render('auth/register')
    registerGet(@Req() req) {
        return {
            title: 'Register',
            user: req.user,
            duplicateEmail: req.flash('duplicateEmail')
        }
    }

    @UseInterceptors(DuplicateEmailInterceptor)
    @UseFilters(DuplicateEmailFilter)
    @Post('register')
    registerPost(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @UseGuards(HomeGuard)
    @Get('signin') 
    @Render('auth/signin')
    signinGet(@Req() req) {
        return {
            title: 'Sign In',
            user: req.user,
            message: req.flash('loginError'),
            registrationSuccess: req.flash('registrationSuccess')
        }
    }

    @UseFilters(SignInFilter)
    @UseGuards(LoginGuard)
    @Post('signin')
    async signIn(@Req() req, @Res() res: Response) { 
        const user = req.user;
        if(user.userRole === 'ADMIN') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }        
    }

    @Post('signout')
    async signOut(@Req() req, @Res() res: Response) {
        req.logout();
        req.flash('signout', 'You successfully signed out');
        res.redirect('/');   
    }



    @UseGuards(LoginGuard)
    @Get('profile')
    @Render('profile')
    getUserProfile(@Req() req) {
        return {
            user: req.user
        }
    }
}
