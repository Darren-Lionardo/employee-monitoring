export class Attendance {
    id: string;
    employee_id: string;
    clock_in: Date;
    clock_out: Date | null;
    photo_url: string | null;
    created_at: Date;
    updated_at: Date;
}
