
export interface FormData {
    id?: string;
    first_name: string;
    last_name: string;
    role: string;
    middle_name?: string;
    preferred_name?: string;
    cell_phone: string;
    email: string;
    home_address: string;
    city: string;
    state: string;
    zip_code: string;
    highest_education_level: string;
    certifications: string;
    skills: string;
    job_title: string;
    job_type: string;
    employment_type: string;
    available_start_date: number[];
    high_school_diploma?: boolean;
    college_degree?: boolean;
    client_employment?: boolean;
    non_compete?: boolean;
    prevent_servicing_clients?: boolean;
    client_names?: string;
    drivers_license?: boolean;
    license_suspended?: boolean;
    has_transportation?: boolean;
    can_visit_clients?: boolean;
    right_to_work?: boolean;
    need_sponsorship?: boolean;
    covid_vaccinated?: boolean;
    will_get_vaccinated?: boolean;
  }