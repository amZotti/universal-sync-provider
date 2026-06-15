import { Inject, Injectable, Logger } from '@nestjs/common';
import { ISyncProvider, BusinessDomain, SyncPayload } from './interfaces/sync.interface';

@Injectable()
export class UniversalSyncService {
    private readonly logger = new Logger(UniversalSyncService.name);

    constructor(
        @Inject('SYNC_PROVIDERS') private readonly providers: ISyncProvider[],
    ) {}

    /**
     * Broadcasts the payload to all external platforms that support the domain. 
     */
    async synchronize(domain: BusinessDomain, payload: SyncPayload): Promise<void> {
        this.logger.log(`Initiating sync for domain: ${domain}`);

        // 1. Find all providers that support this specific domain
        const capableProviders = this.providers.filter((provider) => 
            provider.supportedDomains.includes(domain),
        );

        if (capableProviders.length === 0) {
            this.logger.warn(`No providers configured for domain: ${domain}`);
            return;
        }

        this.logger.log(`Found ${capableProviders.length} provider(s) for ${domain}.`);

        // 2. Execute a sync on all capable providers (running them concurrently)
        const syncTasks = capableProviders.map((provider) => 
            provider.sync(domain, payload).catch((error) => {
                // We catch errors here so one failing provider doesn't crash the rest
                this.logger.error('Failed to sync with ${provider.providerName}: ${error.message}');
            }),
        );
        await Promise.all(syncTasks);
        this.logger.log(`Synchronization complete for domain: ${domain}`);
    }
}