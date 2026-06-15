export enum BusinessDomain {
    LISTINGS = 'LISTINGS',
    COMMUNICATIONS = 'COMMUNICATIONS',
}

export interface SyncPayload {
    id: string;
    data: any;
}

export interface ISyncProvider {
    readonly providerName: string
    readonly supportDomains: BusinessDomain[];

    /** 
     * Executes the syncrhronization logic for the external platform.
     */
    sync(domain: BusinessDomain, payload: SyncPayload): Promise<boolean>;
}
