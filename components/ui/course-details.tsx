interface CourseDetailsProps {
  description: string;
}

export function CourseDetails({ description }: CourseDetailsProps) {
  const parts = description.split('\n\n');
  const courseInfo = parts[parts.length - 1];
  
  if (!courseInfo.includes('Course Dates:')) return null;

  const lines = courseInfo.split('\n');
  const details = {
    dates: lines[0].replace('Course Dates: ', ''),
    time: lines[1].replace('Time: ', ''),
    length: lines[2].replace('Length: ', '')
  };

  return (
    <div className="mt-4 space-y-1 text-sm text-muted-foreground border-t pt-4">
      <p><span className="font-medium">Course Dates:</span> {details.dates}</p>
      <p><span className="font-medium">Time:</span> {details.time}</p>
      <p><span className="font-medium">Length:</span> {details.length}</p>
    </div>
  );
} 