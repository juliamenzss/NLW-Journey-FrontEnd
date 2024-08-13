import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {
    try {
      console.log('Role guard iniciado');
    } catch (error) {
      console.log('erro ao instanciar roleguard', error)
    }
  }

  async canActivate(context: ExecutionContext){
    console.log('iniciando guard')
    const requiridRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiridRoles) {
        return true;
    }

    const {user} = context.switchToHttp().getRequest();

    const rolesFilted = requiridRoles.filter(role => role === user.role)

    return rolesFilted.length > 0;
  }
}
