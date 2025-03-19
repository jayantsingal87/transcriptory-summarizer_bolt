
import { ExportOptions, TranscriptResult } from "@/types/transcript";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

// Export and download transcript results
export async function exportResult(result: TranscriptResult, options: ExportOptions): Promise<any> {
  switch (options.format) {
    case 'pdf':
      return generatePdf(result, options);
    case 'markdown':
      return generateMarkdown(result, options);
    case 'word':
      // For Word, we'll generate HTML that can be opened in Word
      return generateHtml(result, options);
    case 'text':
    default:
      return generateText(result, options);
  }
}

// Save the exported content
export function downloadExport(content: any, filename: string, format: string): void {
  if (format === 'pdf') {
    // PDF content is already a blob
    saveAs(content, filename);
  } else {
    // For other formats, convert to a blob
    const blob = new Blob([content], { type: getContentType(format) });
    saveAs(blob, filename);
  }
}

// Get content type based on format
function getContentType(format: string): string {
  switch (format) {
    case 'markdown':
      return 'text/markdown';
    case 'word':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'text':
    default:
      return 'text/plain';
  }
}

// Generate PDF export
function generatePdf(result: TranscriptResult, options: ExportOptions): Promise<Blob> {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(result.title, 20, 20);
    
    // Add metadata
    doc.setFontSize(10);
    doc.text(`Video ID: ${result.videoId}`, 20, 30);
    doc.text(`Duration: ${result.duration}`, 20, 35);
    doc.text(`Detail Level: ${result.detailLevel}`, 20, 40);
    
    let yPosition = 50;
    
    // Add summary
    if (options.includeSummary) {
      doc.setFontSize(14);
      doc.text("Summary", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(result.summary, 170);
      doc.text(summaryLines, 20, yPosition);
      yPosition += summaryLines.length * 5 + 10;
    }
    
    // Add key takeaways
    if (result.keyTakeaways && result.keyTakeaways.length > 0) {
      doc.setFontSize(14);
      doc.text("Key Takeaways", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      result.keyTakeaways.forEach((takeaway) => {
        const takeawayLines = doc.splitTextToSize(`• ${takeaway}`, 170);
        doc.text(takeawayLines, 20, yPosition);
        yPosition += takeawayLines.length * 5 + 5;
      });
      
      yPosition += 5;
    }
    
    // Add topics
    if (options.includeTopics && result.topics && result.topics.length > 0) {
      doc.setFontSize(14);
      doc.text("Topics", 20, yPosition);
      yPosition += 10;
      
      // Use autoTable for topics
      const topicsData = result.topics.map((topic) => [
        topic.title,
        topic.description,
        topic.timestamps || 'N/A',
        `${topic.coverage}%`
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Title', 'Description', 'Timestamps', 'Coverage']],
        body: topicsData,
      });
      
      // Get the last position after the table
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Add key points
    if (options.includeKeyPoints && result.keyPoints && result.keyPoints.length > 0) {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Key Points", 20, yPosition);
      yPosition += 10;
      
      // Use autoTable for key points
      const keyPointsData = result.keyPoints.map((point) => [
        point.content,
        point.timestamp || 'N/A',
        point.confidence ? `${point.confidence}%` : 'N/A'
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Content', 'Timestamp', 'Confidence']],
        body: keyPointsData,
      });
      
      // Get the last position after the table
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Add original transcript
    if (options.includeOriginalTranscript && result.transcript && result.transcript.length > 0) {
      // Always start the transcript on a new page
      doc.addPage();
      
      doc.setFontSize(14);
      doc.text("Original Transcript", 20, 20);
      
      // Use autoTable for transcript
      const transcriptData = result.transcript.map((segment) => [
        segment.timestamp,
        segment.text
      ]);
      
      autoTable(doc, {
        startY: 30,
        head: [['Timestamp', 'Text']],
        body: transcriptData,
      });
    }
    
    // Save the PDF as a blob
    doc.save(`${result.title}.pdf`);
    resolve(doc.output('blob'));
  });
}

// Generate Markdown export
function generateMarkdown(result: TranscriptResult, options: ExportOptions): string {
  let markdown = `# ${result.title}\n\n`;
  
  // Add metadata
  markdown += `**Video ID:** ${result.videoId}  \n`;
  markdown += `**Duration:** ${result.duration}  \n`;
  markdown += `**Detail Level:** ${result.detailLevel}  \n\n`;
  
  // Add summary
  if (options.includeSummary) {
    markdown += `## Summary\n\n${result.summary}\n\n`;
  }
  
  // Add key takeaways
  if (result.keyTakeaways && result.keyTakeaways.length > 0) {
    markdown += `## Key Takeaways\n\n`;
    result.keyTakeaways.forEach((takeaway) => {
      markdown += `- ${takeaway}\n`;
    });
    markdown += '\n';
  }
  
  // Add topics
  if (options.includeTopics && result.topics && result.topics.length > 0) {
    markdown += `## Topics\n\n`;
    markdown += `| Title | Description | Timestamps | Coverage |\n`;
    markdown += `| ----- | ----------- | ---------- | -------- |\n`;
    
    result.topics.forEach((topic) => {
      markdown += `| ${topic.title} | ${topic.description} | ${topic.timestamps || 'N/A'} | ${topic.coverage}% |\n`;
    });
    
    markdown += '\n';
  }
  
  // Add key points
  if (options.includeKeyPoints && result.keyPoints && result.keyPoints.length > 0) {
    markdown += `## Key Points\n\n`;
    markdown += `| Content | Timestamp | Confidence |\n`;
    markdown += `| ------- | --------- | ---------- |\n`;
    
    result.keyPoints.forEach((point) => {
      markdown += `| ${point.content} | ${point.timestamp || 'N/A'} | ${point.confidence ? `${point.confidence}%` : 'N/A'} |\n`;
    });
    
    markdown += '\n';
  }
  
  // Add original transcript
  if (options.includeOriginalTranscript && result.transcript && result.transcript.length > 0) {
    markdown += `## Original Transcript\n\n`;
    markdown += `| Timestamp | Text |\n`;
    markdown += `| --------- | ---- |\n`;
    
    result.transcript.forEach((segment) => {
      markdown += `| ${segment.timestamp} | ${segment.text} |\n`;
    });
  }
  
  return markdown;
}

// Generate HTML (for Word) export
function generateHtml(result: TranscriptResult, options: ExportOptions): string {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${result.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>${result.title}</h1>
  
  <p><strong>Video ID:</strong> ${result.videoId}</p>
  <p><strong>Duration:</strong> ${result.duration}</p>
  <p><strong>Detail Level:</strong> ${result.detailLevel}</p>`;
  
  // Add summary
  if (options.includeSummary) {
    html += `
  <h2>Summary</h2>
  <p>${result.summary}</p>`;
  }
  
  // Add key takeaways
  if (result.keyTakeaways && result.keyTakeaways.length > 0) {
    html += `
  <h2>Key Takeaways</h2>
  <ul>`;
    
    result.keyTakeaways.forEach((takeaway) => {
      html += `
    <li>${takeaway}</li>`;
    });
    
    html += `
  </ul>`;
  }
  
  // Add topics
  if (options.includeTopics && result.topics && result.topics.length > 0) {
    html += `
  <h2>Topics</h2>
  <table>
    <tr>
      <th>Title</th>
      <th>Description</th>
      <th>Timestamps</th>
      <th>Coverage</th>
    </tr>`;
    
    result.topics.forEach((topic) => {
      html += `
    <tr>
      <td>${topic.title}</td>
      <td>${topic.description}</td>
      <td>${topic.timestamps || 'N/A'}</td>
      <td>${topic.coverage}%</td>
    </tr>`;
    });
    
    html += `
  </table>`;
  }
  
  // Add key points
  if (options.includeKeyPoints && result.keyPoints && result.keyPoints.length > 0) {
    html += `
  <h2>Key Points</h2>
  <table>
    <tr>
      <th>Content</th>
      <th>Timestamp</th>
      <th>Confidence</th>
    </tr>`;
    
    result.keyPoints.forEach((point) => {
      html += `
    <tr>
      <td>${point.content}</td>
      <td>${point.timestamp || 'N/A'}</td>
      <td>${point.confidence ? `${point.confidence}%` : 'N/A'}</td>
    </tr>`;
    });
    
    html += `
  </table>`;
  }
  
  // Add original transcript
  if (options.includeOriginalTranscript && result.transcript && result.transcript.length > 0) {
    html += `
  <h2>Original Transcript</h2>
  <table>
    <tr>
      <th>Timestamp</th>
      <th>Text</th>
    </tr>`;
    
    result.transcript.forEach((segment) => {
      html += `
    <tr>
      <td>${segment.timestamp}</td>
      <td>${segment.text}</td>
    </tr>`;
    });
    
    html += `
  </table>`;
  }
  
  html += `
</body>
</html>`;
  
  return html;
}

// Generate plain text export
function generateText(result: TranscriptResult, options: ExportOptions): string {
  let text = `${result.title}\n\n`;
  
  // Add metadata
  text += `Video ID: ${result.videoId}\n`;
  text += `Duration: ${result.duration}\n`;
  text += `Detail Level: ${result.detailLevel}\n\n`;
  
  // Add summary
  if (options.includeSummary) {
    text += `SUMMARY\n${'='.repeat(30)}\n\n${result.summary}\n\n`;
  }
  
  // Add key takeaways
  if (result.keyTakeaways && result.keyTakeaways.length > 0) {
    text += `KEY TAKEAWAYS\n${'='.repeat(30)}\n\n`;
    result.keyTakeaways.forEach((takeaway, index) => {
      text += `${index + 1}. ${takeaway}\n`;
    });
    text += '\n';
  }
  
  // Add topics
  if (options.includeTopics && result.topics && result.topics.length > 0) {
    text += `TOPICS\n${'='.repeat(30)}\n\n`;
    
    result.topics.forEach((topic, index) => {
      text += `${index + 1}. ${topic.title}\n`;
      text += `   Description: ${topic.description}\n`;
      text += `   Timestamps: ${topic.timestamps || 'N/A'}\n`;
      text += `   Coverage: ${topic.coverage}%\n\n`;
    });
  }
  
  // Add key points
  if (options.includeKeyPoints && result.keyPoints && result.keyPoints.length > 0) {
    text += `KEY POINTS\n${'='.repeat(30)}\n\n`;
    
    result.keyPoints.forEach((point, index) => {
      text += `${index + 1}. ${point.content}\n`;
      text += `   Timestamp: ${point.timestamp || 'N/A'}\n`;
      text += `   Confidence: ${point.confidence ? `${point.confidence}%` : 'N/A'}\n\n`;
    });
  }
  
  // Add original transcript
  if (options.includeOriginalTranscript && result.transcript && result.transcript.length > 0) {
    text += `ORIGINAL TRANSCRIPT\n${'='.repeat(30)}\n\n`;
    
    result.transcript.forEach((segment) => {
      text += `[${segment.timestamp}] ${segment.text}\n`;
    });
  }
  
  return text;
}
