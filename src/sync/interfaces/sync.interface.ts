export enum BusinessDomain {
    LISTINGS = 'LISTINGS',
    COMMUNICATIONS = 'COMMUNICATIONS',
}

export class SyncPayload {
    id: string;
    data: any;
}

export interface ISyncProvider {
    readonly providerName: string
    readonly supportedDomains: BusinessDomain[];

    /** 
     * Executes the synchronization logic for the external platform.
     */
    sync(domain: BusinessDomain, payload: SyncPayload): Promise<boolean>;
}
