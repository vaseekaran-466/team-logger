import { useEffect, useMemo, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { Modal } from '../components/Modal';
import { PageLoader } from '../components/PageLoader';
import { Table } from '../components/Table';
import { TextareaField } from '../components/TextareaField';
import { authActions } from '../features/auth/authSlice';
import { logActions } from '../features/logs/logSlice';
import { userActions } from '../features/users/userSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

const logSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  workDescription: Yup.string().required('Work description is required'),
  hoursWorked: Yup.number()
    .min(0.5, 'Hours must be at least 0.5')
    .max(24, 'Hours cannot exceed 24')
    .required('Hours worked is required'),
});

const defaultLogValues = {
  date: '',
  workDescription: '',
  hoursWorked: 8,
  userId: '',
};

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const logsState = useAppSelector((state) => state.logs);
  const usersState = useAppSelector((state) => state.users);
  const [userSearch, setUserSearch] = useState('');
  const [startDate, setStartDate] = useState(logsState.filters.startDate ?? '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const role = user?.role;
  const isManager = role === 'manager';
  const isUser = role === 'employee';
  const canCreateLogs = isManager;
  const canManageLog = (log) => isManager || log.user?._id === user.id || log.user?.id === user.id;
  const panelLabel = isManager ? 'Manager Dashboard' : isUser ? 'Employee Dashboard' : 'Log Viewer';
  const today = new Date();

  useEffect(() => {
    dispatch(logActions.fetchLogsRequest(logsState.filters));

    if (isManager) {
      dispatch(userActions.fetchUsersRequest());
    }
  }, [dispatch, isManager]);

  const totalHours = useMemo(
    () => logsState.items.reduce((total, log) => total + Number(log.hoursWorked || 0), 0),
    [logsState.items],
  );

  const userSearchTerm = userSearch.trim().toLowerCase();
  const displayedLogs = useMemo(() => {
    if (!isManager || !userSearchTerm) {
      return logsState.items;
    }

    return logsState.items.filter((log) => {
      const name = (log.user?.name ?? '').toLowerCase();
      const email = (log.user?.email ?? '').toLowerCase();
      return name.includes(userSearchTerm) || email.includes(userSearchTerm);
    });
  }, [isManager, logsState.items, userSearchTerm]);

  const getUserId = (item) => item?._id ?? item?.id ?? '';
  const getUserLabel = (item) => (item?.email ? `${item.name} (${item.email})` : item?.name ?? '');

  const currentMonthHours = useMemo(() => {
    const month = today.getMonth();
    const year = today.getFullYear();
    return logsState.items.reduce((total, log) => {
      const logDate = new Date(log.date);
      if (logDate.getMonth() === month && logDate.getFullYear() === year) {
        return total + Number(log.hoursWorked || 0);
      }
      return total;
    }, 0);
  }, [logsState.items]);

  const activeUsers = useMemo(() => {
    const uniqueUsers = new Set(
      logsState.items.map((log) => log.user?._id ?? log.user?.id).filter(Boolean),
    );
    return uniqueUsers.size;
  }, [logsState.items]);
  const latestLog = logsState.items[0];
  const currentMonthLabel = today.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  if (!user) {
    return <PageLoader label="Loading dashboard..." />;
  }

  const applyFilters = () => {
    dispatch(
      logActions.fetchLogsRequest({
        ...logsState.filters,
        startDate,
      }),
    );
  };

  const clearFilters = () => {
    setUserSearch('');
    setStartDate('');
    dispatch(
      logActions.fetchLogsRequest({
        ...logsState.filters,
        startDate: '',
      }),
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLog(null);
  };

  const openCreateModal = () => {
    if (!canCreateLogs) {
      return;
    }

    setEditingLog(null);
    setIsModalOpen(true);
  };

  const openEditModal = (log) => {
    if (!canCreateLogs) {
      return;
    }

    setEditingLog(log);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!canCreateLogs) {
      return;
    }

    if (window.confirm('Are you sure you want to delete this log?')) {
      dispatch(logActions.deleteLogRequest(id));
    }
  };

  const initialLogValues = editingLog
    ? {
        date: editingLog.date.slice(0, 10),
        workDescription: editingLog.workDescription,
        hoursWorked: editingLog.hoursWorked,
        userId: editingLog.user?._id ?? editingLog.user?.id ?? '',
      }
    : defaultLogValues;

  const modalLogSchema =
    isManager && !editingLog
      ? logSchema.shape({
          userId: Yup.string().required('User is required'),
        })
      : logSchema;

  return (
    <div className="dashboard-shell">
      <section className="dashboard-card overflow-hidden px-6 py-6 md:px-8 md:py-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{panelLabel}</p>
            <h1 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.06] text-slate-900">
              Welcome, {user.name}
            </h1>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Button variant="secondary" onClick={() => dispatch(authActions.logout())}>
              Logout
            </Button>
            {canCreateLogs ? <Button onClick={openCreateModal}>Create Log</Button> : null}
          </div>
        </header>
      </section>

      <section className="mt-6 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
        <div className="dashboard-card stat-card">
          <span className="stat-label">Total Logs</span>
          <strong className="mt-3 block text-[2rem] font-semibold text-slate-900">
            {logsState.items.length}
          </strong>
          <p className="mt-2 text-sm text-slate-500">Visible records</p>
        </div>
        <div className="dashboard-card stat-card">
          <span className="stat-label">Total Hours</span>
          <strong className="mt-3 block text-[2rem] font-semibold text-slate-900">{totalHours}</strong>
          <p className="mt-2 text-sm text-slate-500">All visible entries</p>
        </div>
        <div className="dashboard-card stat-card">
          <span className="stat-label">This Month</span>
          <strong className="mt-3 block text-[2rem] font-semibold text-slate-900">
            {currentMonthHours}h
          </strong>
          <p className="mt-2 text-sm text-slate-500">{currentMonthLabel}</p>
        </div>
        <div className="dashboard-card stat-card">
          <span className="stat-label">{isManager ? 'Team Members' : 'Latest Entry'}</span>
          <strong className="mt-3 block text-[2rem] font-semibold text-slate-900">
            {isManager ? activeUsers : latestLog ? new Date(latestLog.date).toLocaleDateString() : '-'}
          </strong>
          <p className="mt-2 text-sm text-slate-500">
            {isManager ? 'Visible in current view' : 'Most recent log date'}
          </p>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6">
        <div className="dashboard-card p-6">
          <div
            className={[
              'dashboard-filter-grid',
              isManager ? 'dashboard-filter-grid--manager' : 'dashboard-filter-grid--user',
            ]
              .join(' ')
              .trim()}
          >
            {isManager ? (
              <div className="dashboard-filter-field">
                <label className="dashboard-filter-label" htmlFor="userSearch">
                  User Search
                </label>
                <input
                  id="userSearch"
                  type="text"
                  className="dashboard-filter-input"
                  placeholder="Search by name or email"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                />
              </div>
            ) : null}

            <div className="dashboard-filter-field">
              <label className="dashboard-filter-label" htmlFor="startDate">
                Date
              </label>
              <input
                id="startDate"
                type="date"
                className="dashboard-filter-input"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>

            <div className="dashboard-filter-actions">
              <Button type="button" className="dashboard-filter-button" onClick={applyFilters}>
                Apply
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="dashboard-filter-button"
                onClick={clearFilters}
              >
                Clear
              </Button>
            </div>
          </div>

          {logsState.error ? <div className="alert alert-error mt-4">{logsState.error}</div> : null}
          {logsState.successMessage ? (
            <div className="alert alert-success mt-4">{logsState.successMessage}</div>
          ) : null}
        </div>

        <div className="dashboard-card p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="section-title">Log Records</h2>
            </div>
            {logsState.loading ? <span className="section-copy">Refreshing data...</span> : null}
          </div>

          <Table
            data={displayedLogs}
            emptyMessage="No logs found for the selected filters."
            columns={[
              {
                key: 'date',
                title: 'Date',
                render: (row) => (
                  <div className="font-semibold text-slate-900">
                    {new Date(row.date).toLocaleDateString()}
                  </div>
                ),
              },
              {
                key: 'user',
                title: 'User',
                render: (row) => (
                  <div>
                    <div className="font-semibold text-slate-900">{row.user?.name ?? '-'}</div>
                    <div className="text-xs text-slate-500">{row.user?.email ?? 'No email available'}</div>
                  </div>
                ),
              },
              {
                key: 'description',
                title: 'Work Description',
                render: (row) => (
                  <div className="max-w-xl leading-6 text-slate-700">{row.workDescription}</div>
                ),
              },
              {
                key: 'hours',
                title: 'Hours',
                render: (row) => (
                  <span className="inline-flex min-w-16 justify-center rounded-full border border-[#d6dfeb] bg-[#f8fbfe] px-3 py-1 text-sm font-semibold text-slate-800">
                    {row.hoursWorked}h
                  </span>
                ),
              },
              {
                key: 'actions',
                title: 'Actions',
                render: (row) => (
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    {canManageLog(row) && canCreateLogs ? (
                      <>
                        <Button variant="secondary" onClick={() => openEditModal(row)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(row._id)}>
                          Delete
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500">View only</span>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      <Modal isOpen={isModalOpen} title={editingLog ? 'Edit Log' : 'Create Log'} onClose={closeModal}>
        <Formik
          initialValues={initialLogValues}
          enableReinitialize
          validationSchema={modalLogSchema}
          onSubmit={(values) => {
            const payload = {
              date: values.date,
              workDescription: values.workDescription,
              hoursWorked: Number(values.hoursWorked),
              ...(isManager && !editingLog ? { userId: values.userId } : {}),
            };

            dispatch(
              logActions.saveLogRequest({
                ...payload,
                id: editingLog?._id,
              }),
            );
            closeModal();
          }}
        >
          <Form className="grid gap-[18px]">
            {isManager && !editingLog ? (
              <InputField label="Assign User" name="userId" as="select">
                <option value="">Select a user</option>
                {usersState.items.map((item) => (
                  <option key={getUserId(item)} value={getUserId(item)}>
                    {getUserLabel(item)}
                  </option>
                ))}
              </InputField>
            ) : null}

            <InputField label="Date" name="date" type="date" />
            <InputField label="Hours Worked" name="hoursWorked" type="number" />
            <TextareaField
              label="Work Description"
              name="workDescription"
              placeholder="Describe what was completed today"
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={logsState.saving}>
                {logsState.saving ? 'Saving...' : editingLog ? 'Update Log' : 'Create Log'}
              </Button>
            </div>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}
