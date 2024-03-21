import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentialsDTO;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const checkUsernameExists = await this.findOne({ username });

    if (checkUsernameExists)
      throw new HttpException('username exists', HttpStatus.FORBIDDEN);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    await this.save(user);
  }
}
