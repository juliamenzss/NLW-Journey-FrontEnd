import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authservice: AuthService,
    private readonly userService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
        const token = ((authorization ?? '').split(' ')[1]);
        if (!token) {
          throw new BadRequestException('No token provided')
        }
        
        const data = this.authservice.checkToken(token)
        if (!data || !data.sub) {
          throw new BadRequestException('Invalid token payload')
        }
        
        request.tokenPayload = data;
        request.user = await this.userService.findById(data.sub);
        
        return true;
      } catch (e) {
        return false;
      }
  }
}
