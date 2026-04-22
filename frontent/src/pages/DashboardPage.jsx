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

const filterSchema = Yup.object({
  userId: Yup.string(),
  startDate: Yup.string(),
  search: Yup.string(),
});

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
};

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const logsState = useAppSelector((state) => state.logs);
  const usersState = useAppSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const role = user?.role;
  const isManager = role === 'manager';
  const canCreateLogs = role === 'user' || role === 'employee';
  const canUseSearchFilter = isManager || canCreateLogs;
  const panelLabel = isManager ? 'Manager Panel' : canCreateLogs ? 'User Panel' : 'Log Viewer';
  const subtitle = isManager
    ? 'Review all team logs and filter work records.'
    : canCreateLogs
      ? 'Create, update, and manage your daily work logs.'
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
      }
    : defaultLogValues;

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">{panelLabel}</p>
          <h1 className="page-title">Welcome, {user.name}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>

        <div className="header-actions">
          <Button variant="secondary" onClick={() => dispatch(authActions.logout())}>
            Logout
          </Button>
          {canCreateLogs ? (
            <Button onClick={openCreateModal}>Create Log</Button>
          ) : null}
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Logs</span>
          <strong>{logsState.items.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total Hours</span>
          <strong>{totalHours}</strong>
        </div>
        <div className="stat-card">
          <span>This Month</span>
          <strong>{currentMonthHours}</strong>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel-card">
          <div className="panel-heading">
            <h2>Filter Logs</h2>
          </div>

          <Formik
            initialValues={logsState.filters}
            enableReinitialize
            validationSchema={filterSchema}
            onSubmit={(values) => {
              dispatch(logActions.fetchLogsRequest(values));
            }}
          >
            {({ resetForm }) => (
              <Form className="filters-grid">
                {isManager ? (
                  <InputField label="User" name="userId" as="select">
                    <option value="">All users</option>
                    {usersState.items.map((item) => (
                      <option key={item._id ?? item.id} value={item._id ?? item.id}>
                        {item.name}
                      </option>
                    ))}
                  </InputField>
                ) : null}

                <InputField label="Start Date" name="startDate" type="date" />

                {canUseSearchFilter ? (
                  <InputField
                    label="Search"
                    name="search"
                    type="text"
                    placeholder="Search work description"
                  />
                ) : null}

                <div className="filter-actions">
                  <Button type="submit" disabled={logsState.loading}>
                    {logsState.loading ? 'Loading...' : 'Apply Filter'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const nextValues = { userId: '', startDate: '', search: '' };
                      resetForm({ values: nextValues });
                      dispatch(logActions.fetchLogsRequest(nextValues));
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          {logsState.error ? <div className="alert alert-error">{logsState.error}</div> : null}
          {logsState.successMessage ? (
            <div className="alert alert-success">{logsState.successMessage}</div>
          ) : null}
        </div>

        <div className="panel-card">
          <h2>Log Records</h2>
          <Table
            data={logsState.items}
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
                  <div className="table-actions">
                    {canCreateLogs &&
                    (row.user?._id === user.id || row.user?.id === user.id) ? (
                      <>
                        <Button variant="secondary" onClick={() => openEditModal(row)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(row._id)}>
                          Delete
                        </Button>
                      </>
                    ) : (
                      <span className="muted-text">View only</span>
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
          validationSchema={logSchema}
          onSubmit={(values) => {
            dispatch(
              logActions.saveLogRequest({
                ...values,
                hoursWorked: Number(values.hoursWorked),
                id: editingLog?._id,
              }),
            );
            closeModal();
          }}
        >
          <Form className="form-layout">
            <InputField label="Date" name="date" type="date" />
            <InputField label="Hours Worked" name="hoursWorked" type="number" />
            <TextareaField
              label="Work Description"
              name="workDescription"
              placeholder="Describe what was completed today"
            />

            <div className="modal-actions">
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
