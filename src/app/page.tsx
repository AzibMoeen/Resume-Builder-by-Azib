'use client'

import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  skills: any[]
  experience: {
    company: string
    position: string
    duration: string
    bullets: string[]
  }[]
}

export default function ResumeBuilder() {
  const router = useRouter()
  const { register, control, handleSubmit, formState: { errors } } = useForm<ResumeData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      github: '',
      linkedin: '',
      education: [{ degree: '', institution: '', year: '' }],
      skills: [''],
      experience: [{ company: '', position: '', duration: '', bullets: [''] }]
    }
  })

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education"
  })

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills"
  })

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience"
  })

  const onSubmit = (data: ResumeData) => {
    localStorage.setItem('resumeData', JSON.stringify(data));  
    
    router.push('/resume-template');  
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Resume Builder By Azib</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" {...register("phone", { required: "Phone is required" })} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" {...register("github")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" {...register("linkedin")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {educationFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <Input
                  placeholder="Degree"
                  {...register(`education.${index}.degree`, { required: "Degree is required" })}
                />
                <Input
                  placeholder="Institution"
                  {...register(`education.${index}.institution`, { required: "Institution is required" })}
                />
                <Input
                  placeholder="Year"
                  {...register(`education.${index}.year`, { required: "Year is required" })}
                />
                <Button type="button" variant="outline" onClick={() => removeEducation(index)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Remove Education
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendEducation({ degree: '', institution: '', year: '' })}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Education
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  {...register(`skills.${index}`, { required: "Skill is required" })}
                />
                <Button type="button" variant="outline" onClick={() => removeSkill(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => {
              appendSkill(''); 
            }}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Skill
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <Input
                  placeholder="Company"
                  {...register(`experience.${index}.company`, { required: "Company is required" })}
                />
                <Input
                  placeholder="Position"
                  {...register(`experience.${index}.position`, { required: "Position is required" })}
                />
                <Input
                  placeholder="Duration"
                  {...register(`experience.${index}.duration`, { required: "Duration is required" })}
                />
                {field.bullets.map((_, bulletIndex) => (
                  <Input
                    key={bulletIndex}
                    placeholder={`Bullet point ${bulletIndex + 1}`}
                    {...register(`experience.${index}.bullets.${bulletIndex}`, { required: "Bullet point is required" })}
                  />
                ))}
                <Button type="button" variant="outline" onClick={() => {
                  const experience = [...experienceFields];
                  experience[index].bullets.push('');
                  appendExperience(experience[index]); // Ensure the bullets are updated
                  removeExperience(index);
                }}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Bullet Point
                </Button>
                <Button type="button" variant="outline" onClick={() => removeExperience(index)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Remove Experience
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendExperience({ company: '', position: '', duration: '', bullets: [''] })}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          <Eye className="h-4 w-4 mr-2" /> View Resume
        </Button>
      </form>
    </div>
  )
}
