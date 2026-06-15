import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UniversalSyncService } from './sync/universal-sync.service';
import { AirbnbProvider } from './sync/providers/airbnb.provider';
import { GmailProvider } from './sync/providers/gmail.provider';
import { SlackProvider } from './sync/providers/slack.provider';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AirbnbProvider,
    GmailProvider,
    SlackProvider,

    // Group external providers under a single injection token
    {
      provide: 'SYNC_PROVIDERS',
      useFactory: (airbnb, gmail, slack) => {
        return [airbnb, gmail, slack];
      },
      inject: [AirbnbProvider, GmailProvider, SlackProvider],
    },

    // Register the core service
    UniversalSyncService,
  ],
})
export class AppModule {}
