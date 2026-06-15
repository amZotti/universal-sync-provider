import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UniversalSyncService } from './sync/universal-sync.service';
import { BusinessDomain } from './sync/interfaces/sync.interface';
import type { SyncPayload } from './sync/interfaces/sync.interface';

@Controller('sync')
export class AppController {
  constructor(private readonly syncService: UniversalSyncService) {}

  @Post(':domain')
  async triggerSync(
    @Param('domain') domain: string,
    @Body() payload: SyncPayload,
  ) {
    const businessDomain = domain.toUpperCase() as BusinessDomain;

    // Fire and forget, or await depending on requirement.
    // Awaiting here so the HTTP response finishes after the sync.
    await this.syncService.synchronize(businessDomain, payload);

    return {
      message: `Sync initiated for ${businessDomain}`,
      status: 'success',
    };
  }
}