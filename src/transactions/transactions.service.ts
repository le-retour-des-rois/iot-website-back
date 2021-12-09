import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions, TransactionsClass } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>
  ) {}



  async create(transactionsClass: TransactionsClass) {
    if (!transactionsClass.method) {
      throw new HttpException('Method missing', HttpStatus.BAD_REQUEST);
    }

    const transaction = await this.transactionsRepository.save(transactionsClass);
    if (!transaction) {
      throw new HttpException('Failed to generate the transaction', HttpStatus.BAD_REQUEST);
    }

    return 'Transaction generated';
  }

  async findAll(): Promise<Transactions[]> {
    return await this.transactionsRepository.find();
  }

  async findOne(id: number): Promise<Transactions> {
    return await this.transactionsRepository.findOne(id);
  }
}
