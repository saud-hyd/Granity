import * as XLSX from 'xlsx';

// Export projects data to Excel
export const exportToExcel = (data, filename = 'projects.xlsx') => {
  // Convert data to format suitable for Excel
  const excelData = data.map(project => ({
    'Project Number': project.projectNumber,
    'Project Name': project.projectName,
    'Drive Link': project.driveLink,
    'Recorded From': project.recordedFrom,
    'Sales Rep': project.salesRep,
    'Scope of Work': project.scopeOfWork,
    'Gen. Contractor': project.genContractor,
    'Contact Person': project.contactPerson,
    'Executed Date': project.executedDate,
    'MM-D-D Date': project.mmDdDate,
    'MM-OD Date': project.mmOdDate,
    'Estimator Name': project.estimatorName,
    'Designer Name': project.designerName,
    'Project Status': project.projectStatus,
    'Project Submitted Value by Estimator': project.submittedValueEstimator,
    'Project Submitted Value by STM/Ruch/Pooja': project.submittedValueSTM,
    'Bid Submitted': project.bidSubmitted,
    'Project Tracker Link': project.projectTrackerLink,
    'Comments/Remarks': project.comments,
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 15 }, // Project Number
    { wch: 35 }, // Project Name
    { wch: 15 }, // Drive Link
    { wch: 15 }, // Recorded From
    { wch: 20 }, // Sales Rep
    { wch: 25 }, // Scope of Work
    { wch: 25 }, // Gen. Contractor
    { wch: 20 }, // Contact Person
    { wch: 18 }, // Executed Date
    { wch: 18 }, // MM-D-D Date
    { wch: 18 }, // MM-OD Date
    { wch: 18 }, // Estimator Name
    { wch: 18 }, // Designer Name
    { wch: 15 }, // Project Status
    { wch: 20 }, // Submitted Value Estimator
    { wch: 20 }, // Submitted Value STM
    { wch: 20 }, // Bid Submitted
    { wch: 20 }, // Project Tracker Link
    { wch: 30 }, // Comments
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');

  // Save file
  XLSX.writeFile(workbook, filename);
};

// Import projects from Excel file
export const importFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel columns to our data structure
        const projects = jsonData.map(row => ({
          projectNumber: row['Project Number'] || '',
          projectName: row['Project Name'] || '',
          driveLink: row['Drive Link'] || '',
          recordedFrom: row['Recorded From'] || '',
          salesRep: row['Sales Rep'] || '',
          scopeOfWork: row['Scope of Work'] || '',
          genContractor: row['Gen. Contractor'] || '',
          contactPerson: row['Contact Person'] || '',
          executedDate: row['Executed Date'] || '',
          mmDdDate: row['MM-D-D Date'] || '',
          mmOdDate: row['MM-OD Date'] || '',
          estimatorName: row['Estimator Name'] || '',
          designerName: row['Designer Name'] || '',
          projectStatus: row['Project Status'] || '',
          submittedValueEstimator: row['Project Submitted Value by Estimator'] || '',
          submittedValueSTM: row['Project Submitted Value by STM/Ruch/Pooja'] || '',
          bidSubmitted: row['Bid Submitted'] || '',
          projectTrackerLink: row['Project Tracker Link'] || '',
          comments: row['Comments/Remarks'] || '',
        }));

        resolve(projects);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Format currency
export const formatCurrency = (value) => {
  if (typeof value === 'string') {
    // Already formatted
    if (value.startsWith('$')) return value;
    // Parse and format
    const num = parseFloat(value.replace(/[$,]/g, ''));
    return isNaN(num) ? '$0.00' : `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (typeof value === 'number') {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return '$0.00';
};

// Parse currency to number
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  return parseFloat(currencyString.replace(/[$,]/g, '')) || 0;
};
