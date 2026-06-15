import { Injectable, Logger } from '@nestjs/common';
import { ISyncProvider, BusinessDomain, SyncPayload } from '../interfaces/sync.interface';

@Injectable()
export class GmailProvider implements ISyncProvider {
    private readonly logger = new Logger(GmailProvider.name);

    readonly providerName = 'Gmail';
    // Gmail only cares about communications.
    readonly supportedDomains = [BusinessDomain.COMMUNICATIONS];

    async sync(domain: BusinessDomain, payload: SyncPayload): Promise<boolean> {
        this.logger.log(`[API MOCK] sending ${domain} email via ${this.providerName}...`);
        this.logger.debug(`Payload send to ${this.providerName}: ${JSON.stringify(payload)}`);
        return true;
    }
}
