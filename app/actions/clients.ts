'use server'

import { createClient as createSupabaseClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  const supabase = await createSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const userData = await prisma.user.findUnique({ where: { email: user.email! } })

  if (!userData || !['ADMIN', 'PARTNER'].includes(userData.role)) {
    throw new Error('Forbidden')
  }

  const clients = await prisma.client.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' }
  })

  return clients
}

export async function createClient(formData: FormData) {
  const supabase = await createSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  const userData = await prisma.user.findUnique({ where: { email: user.email! } })

  if (!userData || !['ADMIN', 'PARTNER'].includes(userData.role)) {
    return { success: false, error: 'Forbidden' }
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string

  if (!name || !email) return { success: false, error: 'Name and email required' }

  try {
    const client = await prisma.client.create({
      data: { name, email }
    })

    await prisma.auditLog.create({
      data: {
        tableName: 'Client',
        recordId: client.id,
        action: 'CREATE',
        userId: userData.id,
        newData: { name, email }
      }
    })

    revalidatePath('/clients')

    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: 'Failed to create client' }
  }
}