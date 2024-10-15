'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Phone, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

type ResumeData = {
  name: string
  email: string
  phone: string
  github: string
  linkedin: string
  education: {
    degree: string
    institution: string
    year: string
  }[]
  skills: string[]
  experience: {
    company: string
    position: string
    duration: string
    bullets: string[]
  }[]
}

export default function ResumeTemplate() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  useEffect(() => {
    // Get resume data from local storage
    const storedResumeData = localStorage.getItem('resumeData')
    if (storedResumeData) {
      setResumeData(JSON.parse(storedResumeData))
    } else {
      // Default data if nothing is found in localStorage
      setResumeData({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        github: 'github.com/johndoe',
        linkedin: 'linkedin.com/in/johndoe',
        education: [
          { degree: 'B.S. in Computer Science', institution: 'University of Example', year: '2018-2022' },
          { degree: 'High School Diploma', institution: 'Example High School', year: '2014-2018' }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
        experience: [
          {
            company: 'Tech Company Inc.',
            position: 'Software Developer',
            duration: 'June 2022 - Present',
            bullets: [
              'Developed and maintained web applications using React and Node.js',
              'Collaborated with cross-functional teams to deliver high-quality software products',
              'Implemented new features and optimized existing codebase for better performance'
            ]
          },
          {
            company: 'Startup XYZ',
            position: 'Intern',
            duration: 'Summer 2021',
            bullets: [
              'Assisted in the development of a mobile app using React Native',
              'Participated in code reviews and contributed to improving coding standards',
              'Gained hands-on experience with agile development methodologies'
            ]
          }
        ]
      })
    }
  }, [])

  const downloadPDF = () => {
    const resumeElement: HTMLElement | null = document.querySelector('.resume-content')  
    if (resumeElement) {
      html2canvas(resumeElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save('resume.pdf')
      })
    }
  }

  if (!resumeData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="resume-content"> 
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">{resumeData.name}</CardTitle>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-2">
              {resumeData.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {resumeData.email}
                </div>
              )}
              {resumeData.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {resumeData.phone}
                </div>
              )}
              {resumeData.github && (
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-1" />
                  {resumeData.github}
                </div>
              )}
              {resumeData.linkedin && (
                <div className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-1" />
                  {resumeData.linkedin}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumeData.education && resumeData.education.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-2">Education</h2>
                <Separator className="mb-2" />
                <ul className="list-disc pl-5 space-y-1">
                  {resumeData.education.map((edu, index) => (
                    <li key={index}>{`${edu.degree}, ${edu.institution}, ${edu.year}`}</li>
                  ))}
                </ul>
              </section>
            )}

            {resumeData.skills && resumeData.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <Separator className="mb-2" />
                <ul className="list-disc pl-5 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                  {resumeData.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </section>
            )}

            {resumeData.experience && resumeData.experience.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-2">Experience</h2>
                <Separator className="mb-2" />
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-lg">{exp.position}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company} | {exp.duration}</p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-sm">{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Download Button placed outside of resume content */}
      <div className="flex justify-center mt-4">
        <Button onClick={downloadPDF}>
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>
    </div>
  )
}
