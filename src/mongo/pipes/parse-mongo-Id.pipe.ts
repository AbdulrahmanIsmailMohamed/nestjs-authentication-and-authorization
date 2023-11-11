import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any /*,metadata: ArgumentMetadata*/) {
    const isMongoId = /^[a-f\d]{24}$/i.test(value);
    if (!isMongoId) {
      throw new BadRequestException(`${value} is not a valid mongo id!`);
    }

    return value;
  }
}
