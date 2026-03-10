"use client";

import { NewAccountsCard } from "./stats-cards";
import { OpenSpaceChart, MeetingRoomChart } from "./reservations-chart";
import { AttendanceChart } from "./attendance-chart";
import { UsersManagementDialog } from "./users-management-dialog";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Admin
          </h1>
          <p className="text-muted-foreground">
            Vue d&apos;ensemble de l&apos;espace de coworking
          </p>
        </div>
        <UsersManagementDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NewAccountsCard />
        <OpenSpaceChart />
        <MeetingRoomChart />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <AttendanceChart />
      </div>
    </div>
  );
}
