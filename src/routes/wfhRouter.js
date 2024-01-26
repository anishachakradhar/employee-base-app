import React from 'react';
import { Router, Switch } from 'react-router-dom';

import WfhTable from 'components/wfh/WfhTable';
import WfhApply from 'components/wfh/WfhApply';
import Navbar from 'components/dashboard/Navbar';
import Sidebar from 'components/dashboard/Sidebar';
import WfhApproveTable from 'components/wfh/WfhApproveTable';

import UserTable from 'components/users/UserTable';
import UserCreate from 'components/users/UserCreate';
import { AuthenticatedRoute } from 'components/routes/AuthenticatedRoute';
import DailyHealthDeclarationNew from 'components/health/DailyHealthDeclarationNew';
import DailyHealthDeclarationTable from 'components/health/DailyHealthDeclarationTable';
import {
  ANNOUNCEMENTS_CREATE,
  ANNOUNCEMENTS_INDEX,
  ANNOUNCEMENTS_SHOW,
  ANNOUNCEMENTS_UPDATE,
  ATTENDANCES_EXPORT,
  DAILY_HEALTH_DECLARATION,
  DAILY_HEALTH_DECLARATION_NEW,
  DAILY_HEALTH_DECLARATION_SHOW,
  DASHBOARD,
  SEND_WFH_REPORT,
  USER_CREATE,
  USER_INDEX,
  WFH,
  WFH_APPLY,
  WFH_REQUESTED,
  WFOS_APPLY,
  WFOS_INDEX,
  WFOS_REQUESTED,
  WFOS_SEND_REPORT
} from 'constants/routes';
import WfoTable from 'components/wfo/WfoTable';
import WfoApply from 'components/wfo/WfoApply';
import WfoApproveTable from 'components/wfo/WfoApproveTable';
import Dashboard from 'components/dashboard/Dashboard';
import AnnouncementTable from 'components/announcements/AnnouncementTable';
import AnnouncementCreate from 'components/announcements/AnnouncementCreate';
import AnnouncementShow from 'components/announcements/AnnouncementShow';
import AttendanceExport from 'components/attendances/AttendanceExport';

const WfhRouter = ({ history, ...props }) => {
  return (
    <div>
      <Sidebar />
      <div className="main-content" id="panel">
        <Navbar />
        <Router history={history}>
          <Switch>
            <AuthenticatedRoute exact path={DASHBOARD} component={Dashboard}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={WFH} component={WfhTable}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={WFH_APPLY} component={WfhApply}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={WFH_REQUESTED} component={WfhApproveTable}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={SEND_WFH_REPORT} component={WfhApply}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={USER_INDEX} component={UserTable}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={USER_CREATE} component={UserCreate}></AuthenticatedRoute>
            <AuthenticatedRoute
              exact
              path={DAILY_HEALTH_DECLARATION}
              component={DailyHealthDeclarationTable}
            ></AuthenticatedRoute>
            <AuthenticatedRoute
              exact
              path={DAILY_HEALTH_DECLARATION_NEW}
              component={DailyHealthDeclarationNew}
            ></AuthenticatedRoute>
            <AuthenticatedRoute
              exact
              path={DAILY_HEALTH_DECLARATION_SHOW}
              component={DailyHealthDeclarationNew}
            ></AuthenticatedRoute>
            <AuthenticatedRoute exact path={WFOS_INDEX} component={WfoTable}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={WFOS_APPLY} component={WfoApply}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={WFOS_REQUESTED} component={WfoApproveTable}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={WFOS_SEND_REPORT} component={WfoApply}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={ANNOUNCEMENTS_INDEX} component={AnnouncementTable}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={ANNOUNCEMENTS_CREATE} component={AnnouncementCreate}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={ANNOUNCEMENTS_SHOW} component={AnnouncementShow}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={ANNOUNCEMENTS_UPDATE} component={AnnouncementCreate}></AuthenticatedRoute>
            <AuthenticatedRoute exact path={ATTENDANCES_EXPORT} component={AttendanceExport}></AuthenticatedRoute>
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default WfhRouter;
