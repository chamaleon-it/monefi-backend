import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BondsModule } from './bonds/bonds.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ApplicationFormModule } from './application_form/application_form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    BondsModule,
    TransactionsModule,
    PortfolioModule,
    ApplicationFormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
