import { Injectable, Logger } from '@nestjs/common';
import { ISyncProvider, BusinessDomain, SyncPayload } from '../interfaces/sync.interface';

@Injectable()
export class AirbnbProvider implements ISyncProvider {
    private readonly logger = new Logger(AirbnbProvider.name);

    readonly providerName = "Airbnb";
    // Airbnb only cares about property listings
    readonly supportedDomains = [BusinessDomain.LISTINGS];

    async sync(domain: BusinessDomain, payload: SyncPayload): Promise<boolean> {
        this.logger.log(`[API MOCK] Syncing ${domain} data to ${this.providerName}...`);
        this.logger.debug(`Payload sent to ${this.providerName}: ${JSON.stringify(payload)}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        this.logger.log(`Successfully synced to ${this.providerName}`);
        return true;
    }
}
