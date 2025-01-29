export interface Company {
    work_history_id?: string;
    company_name?: string;
    employer_name?: string;
    position?: string;
    duties?: string;
    manager_name?: string;
    phone?: string;
    industry?: string;
    start_date?: number[];
    end_date?: number[];
    currently_working?: boolean;
    reason_for_leaving?: string;
}