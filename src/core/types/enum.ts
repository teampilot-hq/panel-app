//user enum

export enum UserStatus {
    ENABLED = "ENABLED",
    DISABLED = "DISABLED",
    ARCHIVED = "ARCHIVED"
}

export enum UserRole {
    ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN",
    EMPLOYEE = "EMPLOYEE",
    TEAM_ADMIN = "TEAM_ADMIN"
}

export enum UserRoleJson {
    ORGANIZATION_ADMIN = "Admin",
    EMPLOYEE = "Employee",
    TEAM_ADMIN = "Team Admin"
}

//leave enum and const

export enum LeaveStatus {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
}
export enum LeaveStatusJson {
    PENDING = "Pending",
    ACCEPTED = "Accepted",
    REJECTED = "Rejected"
}

export enum LeaveTypeCycle {
    UNLIMITED = 'UNLIMITED',
    PER_MONTH = 'PER_MONTH',
    PER_YEAR = 'PER_YEAR'
}

export enum LeaveTypeCycleJson {
    UNLIMITED = 'Unlimited',
    PER_MONTH = 'Per Month',
    PER_YEAR = 'Per Year'
}

export enum LeaveTypeStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED'
}


export enum Week {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}