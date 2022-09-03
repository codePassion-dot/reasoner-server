import { Repository } from 'typeorm';
import { Connection } from './connection.entity';

export class ConnectionsRepository extends Repository<Connection> {}
