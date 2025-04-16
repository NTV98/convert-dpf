import { Module } from '@nestjs/common';
//import { NotificationModule } from './app/notification/notification.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { mongoUri } from '@const';
// import { mongoUriUser } from '@const';
import { AuthenticationModule } from '@auth/authentication.module';
import { ConsumerModule } from './consumer/consumer.module';
@Module({
  imports: [
    // MongooseModule.forRoot(mongoUri),
    // MongooseModule.forRoot(mongoUriUser, { connectionName: 'user' }),
    AuthenticationModule,
    ConsumerModule,
    //NotificationModule,
  ],
})
export class AppModule { }
