const fetch = require('node-fetch');

async function updateCourses() {
  try {
    console.log('Updating course descriptions...');
    const descResponse = await fetch('http://localhost:3000/api/products/update-descriptions');
    const descResult = await descResponse.json();
    console.log('Description update result:', descResult);

    console.log('\nUpdating course details...');
    const detailsResponse = await fetch('http://localhost:3000/api/products/update-course-details');
    const detailsResult = await detailsResponse.json();
    console.log('Details update result:', detailsResult);

    console.log('\nAll updates completed successfully!');
  } catch (error) {
    console.error('Error updating courses:', error);
  }
}

updateCourses(); 