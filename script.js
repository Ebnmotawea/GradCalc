  function showHomeImage() {
      const homeImage = document.getElementById('homeImage');
      if (homeImage) {
          console.log("Showing home image.");
          homeImage.removeAttribute('hidden');
      } else {
          console.error("homeImage not found!");
      }
  }

  function hideHomeImage() {
      const homeImage = document.getElementById('homeImage');
      if (homeImage) {
          console.log("Hiding home image.");
          homeImage.setAttribute('hidden', 'true');
      } else {
          console.error("homeImage not found!");
      }
  }

    // Select the Go Backward button
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

    // Navigation logic for Go Backward button
    function showGoBackButton(callback) {
        goBackButton.style.display = 'block';
        goBackButton.onclick = callback;
    }

    // Hide the Go Backward button
    function hideGoBackButton() {
        goBackButton.style.display = 'none';
        goBackButton.onclick = null;
    }

    let accessedFromSemester2Direct = false; // Flag to track how we accessed semester 2

    // Show First Semester Section
    document.getElementById('firstSemester').addEventListener('click', function () {
           hideHomeImage(); // Hide image when navigating to the first semester
        document.getElementById('start').style.display = 'none';
        document.getElementById('semester1').style.display = 'block';
        showGoBackButton(() => {
            document.getElementById('semester1').style.display = 'none';
            document.getElementById('semester2').style.display = 'none'; // Ensure second semester is hidden
            resetSecondSemester(); // Reset second semester inputs and warnings
            document.getElementById('start').style.display = 'block';
            hideGoBackButton();
        });
    });

    // Show Second Semester Section Directly
    document.getElementById('secondSemester').addEventListener('click', function () {
        hideHomeImage(); // Hide image when navigating to the first semester
        accessedFromSemester2Direct = true; // Direct access
        document.getElementById('start').style.display = 'none';
        document.getElementById('semester2').style.display = 'block';

        // Show the First Semester Percentage field
        const semester1PercentageContainer = document.getElementById('semester1PercentageContainer');
        const semester1PercentageInput = document.getElementById('semester1Percentage');
        semester1PercentageInput.value = ''; // Clear any previous value
        semester1PercentageInput.removeAttribute('readonly'); // Make it editable
        semester1PercentageContainer.style.display = 'block'; // Show container

        showGoBackButton(() => {
            document.getElementById('semester2').style.display = 'none';
            document.getElementById('start').style.display = 'block';
            hideGoBackButton();
        });
    });

    // Calculate First Semester Grades
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
        document.getElementById('semester1').style.display = 'none';
        document.getElementById('semester2').style.display = 'block';
        const semester1PercentageInput = document.getElementById('semester1Percentage');
        semester1PercentageInput.value = semester1Percentage;
        semester1PercentageInput.setAttribute('readonly', 'true'); // Make it read-only

        // Hide the container since it is pre-filled
        document.getElementById('semester1PercentageContainer').style.display = 'none';

        // Update Go Back button behavior
        showGoBackButton(() => {
            document.getElementById('semester2').style.display = 'none';
            document.getElementById('semester1').style.display = 'block';

            // Update Go Back button for returning to the main page
            showGoBackButton(() => {
                document.getElementById('semester1').style.display = 'none';
                document.getElementById('start').style.display = 'block';
                hideGoBackButton();
            });
        });
    });

    // Calculate Final Total After Second Semester (Prediction)
    document.getElementById('calculateSemester2').addEventListener('click', function () {
        const semester1PercentageInput = document.getElementById('semester1Percentage');
        const semester1PercentageWarning = document.getElementById('semester1PercentageWarning');
        const semester1Percentage = parseFloat(semester1PercentageInput.value);

        // Validate the first semester percentage
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

        // Loop through the second semester grades
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

        // Check if all second semester grades are filled
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
