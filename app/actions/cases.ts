'use server'

import { createClient as createSupabaseClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCases() {
  const supabase = await createSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const userData = await prisma.user.findUnique({ where: { email: user.email! } })

  if (!userData) throw new Error('User not found')

  let cases

  if (userData.role === 'ADMIN' || userData.role === 'PARTNER') {
    cases = await prisma.case.findMany({
      where: { deletedAt: null },
      include: { client: true, lawyer: true },
      orderBy: { createdAt: 'desc' }
    })
  } else if (userData.role === 'LAWYER') {
    cases = await prisma.case.findMany({
      where: { deletedAt: null, lawyerId: userData.id },
      include: { client: true, lawyer: true },
      orderBy: { createdAt: 'desc' }
    })
  } else {
    // CLIENT
    const clientCases = await prisma.case.findMany({
      where: { deletedAt: null, clientId: userData.clientId! },
      include: { client: true, lawyer: true },
      orderBy: { createdAt: 'desc' }
    })
    cases = clientCases
  }

  return cases
}

export async function createCase(formData: FormData) {
  const supabase = await createSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  const userData = await prisma.user.findUnique({ where: { email: user.email! } })

  if (!userData || !['ADMIN', 'PARTNER'].includes(userData.role)) {
    return { success: false, error: 'Forbidden' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const clientId = formData.get('clientId') as string
  const lawyerId = formData.get('lawyerId') as string
  const retainerAmount = parseFloat(formData.get('retainerAmount') as string) || 0

  if (!title || !clientId || !lawyerId) return { success: false, error: 'Required fields missing' }

  // Generate case number
  const lastCase = await prisma.case.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { caseNumber: true }
  })

  let caseNumber = 'CASE-2024-001'
  if (lastCase) {
    const num = parseInt(lastCase.caseNumber.split('-')[2]) + 1
    caseNumber = `CASE-2024-${num.toString().padStart(3, '0')}`
  }

  try {
    const caseData = await prisma.case.create({
      data: {
        caseNumber,
        title,
        description,
        clientId,
        lawyerId,
        retainerAmount,
      }
    })

    await prisma.auditLog.create({
      data: {
        tableName: 'Case',
        recordId: caseData.id,
        action: 'CREATE',
        userId: userData.id,
        newData: { title, description, clientId, lawyerId, retainerAmount }
      }
    })

    revalidatePath('/cases')

    return { success: true, data: caseData }
  } catch (error) {
    return { success: false, error: 'Failed to create case' }
  }
}