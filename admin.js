const API_URL = "http://localhost:3000";


const adminAppointmentsGrid = document.getElementById('adminAppointmentsGrid');
const statAppointments = document.getElementById('statAppointments');
const statRevenue = document.getElementById('statRevenue');
const statPending = document.getElementById('statPending');
const editForm = document.getElementById('editForm');


let bootstrapEditModal;


async function loadAdminDashboard() {
    try {
       
        const [appResponse, billResponse] = await Promise.all([
            fetch(`${API_URL}/appointments`),
            fetch(`${API_URL}/billing`)
        ]);

        if (!appResponse.ok || !billResponse.ok) throw new Error("Data retrieval processing failure.");

        const appointments = await appResponse.json();
        const bills = await billResponse.json();

        
        statAppointments.innerText = appointments.length;

        
        const totalPaid = bills
            .filter(b => b.payment_status === "Paid")
            .reduce((sum, current) => sum + Number(current.total_amount), 0);
        statRevenue.innerText = `Rs. ${totalPaid.toLocaleString()}`;

        
        const totalPendingCount = bills.filter(b => b.payment_status === "Pending").length;
        statPending.innerText = totalPendingCount;

       
        adminAppointmentsGrid.innerHTML = appointments.map(app => {
            let statusBadgeClass = "bg-primary";
            if (app.status === "Completed") statusBadgeClass = "bg-success";
            if (app.status === "Cancelled") statusBadgeClass = "bg-danger";

            return `
                <tr>
                    <td><span class="text-muted small fw-mono">#${app.id}</span></td>
                    <td class="fw-bold text-secondary">${app.patient_name}</td>
                    <td><i class="fa-regular fa-calendar me-2 text-muted"></i>${app.app_date}</td>
                    <td><span class="text-truncate d-inline-block" style="max-width: 240px;">${app.reason}</span></td>
                    <td><span class="badge ${statusBadgeClass}">${app.status}</span></td>
                    <td class="text-end">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-dark" onclick="openEditFlow('${app.id}')">
                                <i class="fa-solid fa-user-pen"></i> Edit
                            </button>
                            <button class="btn btn-danger" onclick="deleteAppointmentRecord('${app.id}')">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        console.error("Administrative data render failure:", err);
    }
}


async function openEditFlow(recordId) {
    try {
        const response = await fetch(`${API_URL}/appointments/${recordId}`);
        if (!response.ok) return;
        
        const recordData = await response.json();

        
        document.getElementById('editRecordId').value = recordData.id;
        document.getElementById('editPatientName').value = recordData.patient_name;
        document.getElementById('editAppDate').value = recordData.app_date;
        document.getElementById('editAppReason').value = recordData.reason;
        document.getElementById('editStatus').value = recordData.status;

        
        if (!bootstrapEditModal) {
            bootstrapEditModal = new bootstrap.Modal(document.getElementById('editModal'));
        }
        bootstrapEditModal.show();
    } catch (err) {
        console.error(err);
    }
}


editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const targetId = document.getElementById('editRecordId').value;
    const modifiedPayload = {
        patient_name: document.getElementById('editPatientName').value.trim(),
        app_date: document.getElementById('editAppDate').value,
        reason: document.getElementById('editAppReason').value.trim(),
        status: document.getElementById('editStatus').value
    };

    try {
        const response = await fetch(`${API_URL}/appointments/${targetId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(modifiedPayload)
        });

        if (response.ok) {
            bootstrapEditModal.hide();
            loadAdminDashboard(); 
        }
    } catch (err) {
        console.error(err);
    }
});


async function deleteAppointmentRecord(targetId) {
    const userChoiceConfirmation = confirm("Warning: Are you absolutely certain you want to permanently delete this patient booking assignment record entry from the system?");
    if (!userChoiceConfirmation) return; // Halt instantly if user aborts command

    try {
        const response = await fetch(`${API_URL}/appointments/${targetId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            loadAdminDashboard();
        }
    } catch (err) {
        console.error(err);
    }
}


window.onload = () => loadAdminDashboard();
