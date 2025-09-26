import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CourseDetailPage = () => {
  // --- This is correct! Hooks can only be used in frontend components. ---
  const router = useRouter();
  const { courseId } = router.query; 
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return; 

    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // **IMPORTANT:** Use the corrected API endpoint path: /api/courses/courseDetails
        const response = await fetch(`/api/courses/courseDetails?courseId=${courseId}`); 
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error fetching course: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) return <div style={{padding: '20px', textAlign: 'center'}}>Loading course details...</div>;
  if (error) return <div style={{padding: '20px', color: 'red', textAlign: 'center'}}>Error: {error}</div>;
  if (!course || course.error) return <div style={{padding: '20px', textAlign: 'center'}}>Course not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{course.title}</h1>
      
      <section style={{ marginBottom: '20px' }}>
        <h2>Course Summary</h2>
        <p>{course.course_summary}</p>
      </section>

      <hr />

      <section style={{ marginBottom: '20px' }}>
        <h2>What You Will Learn</h2>
        {course.what_you_will_learn?.length > 0 ? (
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {course.what_you_will_learn.map((point, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{point}</li>
            ))}
          </ul>
        ) : (
          <p>No learning objectives provided.</p>
        )}
      </section>

      <hr />

      <section style={{ marginBottom: '20px' }}>
        <h2>Course Syllabus (Topics)</h2>
        {course.syllabus_structure?.length > 0 ? (
          <ol style={{ paddingLeft: '20px' }}>
            {course.syllabus_structure
              .sort((a, b) => a.order - b.order)
              .map((topic) => (
                <li key={topic.order} style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {topic.title}
                </li>
              ))}
          </ol>
        ) : (
          <p>Syllabus structure not yet defined.</p>
        )}
      </section>
      
      <p style={{ marginTop: '30px', fontSize: '14px', color: '#666', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        Course ID: {course.course_id}
      </p>
    </div>
  );
};

export default CourseDetailPage;