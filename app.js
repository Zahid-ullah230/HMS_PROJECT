const API_URL = "http://localhost:3000";

// DOM Elements
const doctorsGrid = document.getElementById('doctorsGrid');
const doctorSelect = document.getElementById('doctorSelect');
const deptFilter = document.getElementById('deptFilter');
const appointmentForm = document.getElementById('appointmentForm');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const doctorsTable = document.getElementById('doctorsTable');
const validationError = document.getElementById('validationError');


async function fetchDoctors(filterDept = "All") {
    try {
        loadingState.classList.remove('d-none');
        doctorsTable.classList.add('d-none');
        errorState.classList.add('d-none');

        const response = await fetch(`${API_URL}/doctors`);
        if (!response.ok) throw new Error("Database network check failed."); // response.ok check

        const doctors = await response.json();
        
      
        const filteredDoctors = filterDept === "All" ? 
            doctors : doctors.filter(doc => doc.department === filterDept);

        
        doctorsGrid.innerHTML = filteredDoctors.map(doc => `
            <tr>
                <td class="fw-semibold text-primary"><i class="fa-user-doctor fa-solid me-2"></i>${doc.name}</td>
                <td><span class="badge bg-secondary">${doc.specialization}</span></td>
                <td><span class="text-muted fw-medium">${doc.department}</span></td>
            </tr>
        `).join('');

        
        if (doctorSelect.children.length === 0) {
            doctorSelect.innerHTML = doctors.map(doc => `<option value="${doc.id}">${doc.name} (${doc.specialization})</option>`).join('');
        }

        loadingState.classList.add('d-none');
        doctorsTable.classList.remove('d-none');
    } catch (error) {
        console.error(error);
        loadingState.classList.add('d-none');
        errorState.classList.remove('d-none');
    }
}


appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevents browser refresh so fetch can run smoothly
    validationError.classList.add('d-none');

    
    const patientName = document.getElementById('patientName').value.trim();
    const doctorId = document.getElementById('doctorSelect').value;
    const appDate = document.getElementById('appDate').value;
    const patientPhone = document.getElementById('patientPhone').value.trim();
    const appReason = document.getElementById('appReason').value.trim();

    
    if (!patientName || !appDate || !patientPhone || !appReason) {
        validationError.innerText = "Error: All fields are required to complete your booking registration.";
        validationError.classList.remove('d-none');
        return;
    }
    if (patientPhone.length < 11 || isNaN(patientPhone)) {
        validationError.innerText = "Error: Please enter a valid 11-digit Pakistani mobile connection identifier number.";
        validationError.classList.remove('d-none');
        return;
    }

    
    const bookingPayload = {
        patient_name: patientName,
        doctor_id: doctorId,
        app_date: appDate,
        reason: appReason,
        status: "Scheduled"
    };

    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingPayload) // Transmit stringified JSON payload string
        });

        if (response.ok) {
            appointmentForm.reset();
            alert("Success! Your medical appointment booking session has been saved.");
            // Re-render data dynamically
            fetchDoctors(deptFilter.value);
        }
    } catch (err) {
        console.error(err);
    }
});

// Event Listener for the filtering feature
deptFilter.addEventListener('change', (e) => {
    fetchDoctors(e.target.value);
});

// Initialize Page Load Operation
window.onload = () => fetchDoctors();