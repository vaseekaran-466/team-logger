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

const glassCardClass =
  'rounded-3xl border border-white/70 bg-[rgba(255,255,255,0.88)] p-8 shadow-[0_18px_45px_rgba(28,50,84,0.12)] backdrop-blur-[10px]';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const logsState = useAppSelector((state) => state.logs);
  const usersState = useAppSelector((state) => state.users);
  const [userSearch, setUserSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const role = user?.role;
  const isManager = role === 'manager';
  const isUser = role === 'employee';
  const canCreateLogs = isManager;
  const canManageLog = (log) => isManager || log.user?._id === user.id || log.user?.id === user.id;
  const panelLabel = isManager ? 'Manager Panel' : isUser ? 'User Panel' : 'Log Viewer';
  const subtitle = isManager
    ? 'Create and manage logs from the manager workspace.'
    : isUser
      ? 'View your work logs from the user workspace.'
      : 'View work logs with read-only access.';

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
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return logsState.items.reduce((total, log) => {
      const logDate = new Date(log.date);
      if (logDate.getMonth() === month && logDate.getFullYear() === year) {
        return total + Number(log.hoursWorked || 0);
      }
      return total;
    }, 0);
  }, [logsState.items]);

  if (!user) {
    return <PageLoader label="Loading dashboard..." />;
  }

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
    <div className="min-h-screen p-5 md:p-8">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="m-0 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[#0f5cc0]">
            {panelLabel}
          </p>
          <h1 className="my-2 mb-3 text-[clamp(2rem,4vw,3.4rem)] leading-[1.1] text-slate-900">
            Welcome, {user.name}
          </h1>
          <p className="text-slate-500">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Button variant="secondary" onClick={() => dispatch(authActions.logout())}>
            Logout
          </Button>
          {canCreateLogs ? (
            <Button onClick={openCreateModal}>Create Log</Button>
          ) : null}
        </div>
      </header>

      <section className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        <div className={`${glassCardClass} p-6`}>
          <span className="block text-slate-500">Total Logs</span>
          <strong className="mt-2.5 block text-[2rem]">{logsState.items.length}</strong>
        </div>
        <div className={`${glassCardClass} p-6`}>
          <span className="block text-slate-500">Total Hours</span>
          <strong className="mt-2.5 block text-[2rem]">{totalHours}</strong>
        </div>
        <div className={`${glassCardClass} p-6`}>
          <span className="block text-slate-500">This Month</span>
          <strong className="mt-2.5 block text-[2rem]">{currentMonthHours}</strong>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6">
        {isManager ? (
          <div className={glassCardClass}>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="w-full md:max-w-md">
                <label className="mb-2 block font-semibold text-slate-900" htmlFor="userSearch">
                  User Search
                </label>
                <input
                  id="userSearch"
                  type="text"
                  className="h-11 w-full rounded-2xl border border-[#d7deea] bg-white px-3.5 text-sm outline-none transition-shadow duration-200 focus:border-[#0f5cc0] focus:shadow-[0_0_0_4px_rgba(15,92,192,0.12)]"
                  placeholder="Search by name or email"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setUserSearch('');
                }}
              >
                Clear
              </Button>
            </div>

            {logsState.error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-[0.95rem] text-red-700">
                {logsState.error}
              </div>
            ) : null}
            {logsState.successMessage ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[0.95rem] text-emerald-700">
                {logsState.successMessage}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={glassCardClass}>
          <h2 className="text-xl font-semibold text-slate-900">Log Records</h2>
          <Table
            data={displayedLogs}
            emptyMessage="No logs found for the selected filters."
            columns={[
              {
                key: 'date',
                title: 'Date',
                render: (row) => new Date(row.date).toLocaleDateString(),
              },
              {
                key: 'user',
                title: 'User',
                render: (row) => row.user?.name ?? '-',
              },
              {
                key: 'description',
                title: 'Work Description',
                render: (row) => row.workDescription,
              },
              {
                key: 'hours',
                title: 'Hours',
                render: (row) => row.hoursWorked,
              },
              {
                key: 'actions',
                title: 'Actions',
                render: (row) => (
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {canManageLog(row) && canCreateLogs ? (
                      <>
           <Button variant="secondary" onClick={() => openEditModal(row)}> Edit </Button>
         <Button variant="danger" onClick={() => handleDelete(row._id)}>
                          Delete
                        </Button>
                      </>
                    ) : (
                      <span className="text-slate-500">View only</span>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        title={editingLog ? 'Edit Log' : 'Create Log'}
        onClose={closeModal}
      >
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
          {() => {
            return (
              <Form className="grid gap-[18px]">
                {isManager && !editingLog ? (
                  <>
                    <InputField label="Assign User" name="userId" as="select">
                      <option value="">Select a user</option>
                      {usersState.items.map((item) => (
                        <option key={getUserId(item)} value={getUserId(item)}>
                          {getUserLabel(item)}
                        </option>
                      ))}
                    </InputField>
                  </>
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
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
}
