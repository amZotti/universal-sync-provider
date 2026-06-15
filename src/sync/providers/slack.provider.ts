import { Injectable, Logger } from '@nestjs/common';
import { ISyncProvider, BusinessDomain, SyncPayload } from '../interfaces/sync.interface';

@Injectable()
export class SlackProvider implements ISyncProvider {
    private readonly logger = new Logger(SlackProvider.name);

    readonly providerName = 'Slack';
    // Slack only cares about communications.
    readonly supportDomains = [BusinessDomain.COMMUNICATIONS];

    async sync(domain: BusinessDomain, payload: SyncPayload): Promise<boolean> {
        this.logger.log(`[API MOCK] Posting ${domain} message to ${this.providerName}...`);
        this.logger.debug(`Payload sent to ${this.providerName}: ${JSON.stringify(payload)}`);
        return true;
    }
}
