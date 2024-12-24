// Select the Go Back button
const goBackButton = document.getElementById('goBack');

// Reset Second Semester Table and State
function resetSecondSemester() {
    const gradeInputs = document.querySelectorAll('#semester2DirectTable .gradeInput');
    gradeInputs.forEach(input => {
        input.value = ''; // Clear inputs
    });
    document.getElementById('semester2Warning').style.display = 'none'; // Hide warnings
    document.getElementById('semester2Result').style.display = 'none'; // Hide results
}

// Navigation logic for Go Back button
function toggleGoBackButton(show, callback) {
    if (show) {
        goBackButton.style.display = 'block';
        goBackButton.onclick = callback;
    } else {
        goBackButton.style.display = 'none';
        goBackButton.onclick = null;
    }
}

// Show/Hide First and Second Semester Sections
function showSemesterSection(semester, callback) {
    document.getElementById('start').style.display = 'none';
    document.getElementById(semester).style.display = 'block';
    toggleGoBackButton(true, callback);
}

// Handle Go Back logic for First and Second Semester sections
document.getElementById('firstSemester').addEventListener('click', function () {
    showSemesterSection('semester1', () => {
        document.getElementById('semester1').style.display = 'none';
        document.getElementById('semester2').style.display = 'none'; // Hide second semester
        resetSecondSemester();
        document.getElementById('start').style.display = 'block';
        toggleGoBackButton(false);
    });
});

document.getElementById('secondSemester').addEventListener('click', function () {
    accessedFromSemester2Direct = true; // Flag for direct access
    showSemesterSection('semester2', () => {
        document.getElementById('semester2').style.display = 'none';
        document.getElementById('start').style.display = 'block';
        toggleGoBackButton(false);
    });

    // Show the Semester 1 Percentage input
    const semester1PercentageInput = document.getElementById('semester1Percentage');
    semester1PercentageInput.value = ''; // Clear previous value
    semester1PercentageInput.removeAttribute('readonly');
    document.getElementById('semester1PercentageContainer').style.display = 'block'; // Show container
});

// Calculate Semester 1 Grades
document.getElementById('calculateSemester1').addEventListener('click', function () {
    const gradeInputs = document.querySelectorAll('#semester1Table .gradeInput');
    let total = 0;
    let allFilled = true;

    gradeInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0 || value > parseFloat(input.dataset.max)) {
            allFilled = false;
        } else {
            total += value;
        }
    });

    const warning = document.getElementById('semester1Warning');
    const result = document.getElementById('semester1Result');
    const predictButton = document.getElementById('predictFinal');

    if (!allFilled) {
        warning.style.display = 'block';
        warning.textContent = 'يرجى إدخال درجات صحيحة لجميع المواد (من 0 إلى 40).';
        result.style.display = 'none';
        predictButton.style.display = 'none';
    } else {
        warning.style.display = 'none';
        const percentage = ((total / 320) * 100).toFixed(2); // Calculate percentage
        result.style.display = 'block';
        result.textContent = `النسبة المئوية الإجمالية للفصل الدراسي الأول هي: ${percentage}%`;
        predictButton.style.display = 'block';
    }
});

// Predict Final Total
document.getElementById('predictFinal').addEventListener('click', function () {
    const semester1Result = document.getElementById('semester1Result').textContent || '';
    const semester1Percentage = parseFloat(semester1Result.split(':')[1]?.trim() || 0);

    if (isNaN(semester1Percentage)) {
        alert('يرجى حساب النسبة المئوية للفصل الدراسي الأول قبل التنبؤ بالمجموع النهائي.');
        return;
    }

    // Show second semester section and pre-fill the percentage
    showSemesterSection('semester2', () => {
        document.getElementById('semester2').style.display = 'none';
        document.getElementById('semester1').style.display = 'block';
        toggleGoBackButton(true, () => {
            document.getElementById('semester1').style.display = 'none';
            document.getElementById('start').style.display = 'block';
            toggleGoBackButton(false);
        });
    });

    const semester1PercentageInput = document.getElementById('semester1Percentage');
    semester1PercentageInput.value = semester1Percentage;
    semester1PercentageInput.setAttribute('readonly', 'true');
    document.getElementById('semester1PercentageContainer').style.display = 'none'; // Hide the container
});

// Calculate Final Total After Second Semester (Prediction)
document.getElementById('calculateSemester2').addEventListener('click', function () {
    const semester1PercentageInput = document.getElementById('semester1Percentage');
    const semester1PercentageWarning = document.getElementById('semester1PercentageWarning');
    const semester1Percentage = parseFloat(semester1PercentageInput.value);

    // Validate first semester percentage
    if (isNaN(semester1Percentage) || semester1Percentage < 0 || semester1Percentage > 100) {
        semester1PercentageWarning.style.display = 'block';
        semester1PercentageWarning.textContent = 'يرجى إدخال نسبة صحيحة للفصل الدراسي الأول (من 0 إلى 100).';
        return;
    } else {
        semester1PercentageWarning.style.display = 'none';
    }

    const semester1Total = (semester1Percentage / 100) * 320; // Calculate semester 1 total from percentage
    const gradeInputs = document.querySelectorAll('#semester2DirectTable .gradeInput');
    let semester2Total = 0;
    let allFilled = true;

    // Loop through second semester grades
    gradeInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0 || value > parseFloat(input.dataset.max)) {
            allFilled = false;
        } else {
            semester2Total += value;
        }
    });

    const warning = document.getElementById('semester2Warning');
    const result = document.getElementById('semester2Result');

    if (!allFilled) {
        warning.style.display = 'block';
        warning.textContent = 'يرجى إدخال درجات صحيحة لجميع المواد (من 0 إلى 60).';
        result.style.display = 'none';
    } else {
        warning.style.display = 'none';
        const finalTotal = semester1Total + semester2Total; // Combine totals
        const finalPercentage = ((finalTotal / 800) * 100).toFixed(2); // Calculate final percentage
        result.style.display = 'block';
        const isPrediction = accessedFromSemester2Direct ? "" : "المتوقعة ";
        result.textContent = `النسبة الإجمالية ${isPrediction}للمجموع النهائي هي: ${finalPercentage}%`;
    }
});
