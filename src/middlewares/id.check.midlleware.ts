import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

@Injectable()
export class IdCheckMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        console.log('passando aqui');
        
        next()
    }
}