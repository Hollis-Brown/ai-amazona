'use client'

import { GraduationCap } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">About the Instructor</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              <span className="font-semibold">Kyli Brown</span> is an experienced educator specializing in U.S. History, Political Science, and American foreign policy. With a Master's degree in International Policy Studies focusing on Terrorism Studies and French Studies, she is dedicated to helping British and European professionals gain an in-depth understanding of the United States.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              For 20 years, she has taught extensively both in California and internationally—including New Zealand, Georgia, Turkey, Italy, and Mexico. Her professional experiences living in France, Iceland, and the United Kingdom have significantly shaped her global perspective and teaching style.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Her thematic, seminar-based courses in U.S. History and American foreign policy emphasize critical thinking and global awareness.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Today, we live in unprecedented times where understanding history, politics, and culture has never been more critical. Her goal is to empower international learners to see beyond news headlines and social media narratives, offering deeper insights into American history and culture and how it directly affects the UK and Europe.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Outside the classroom, she volunteers with Ukrainian refugees settled in the United States, assisting them with language skills and cultural adaptation.
            </p>
            
            <p className="text-gray-700 leading-relaxed font-medium italic text-center mt-8">
              Join her to explore American history in a fresh, insightful, and transformative way!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 