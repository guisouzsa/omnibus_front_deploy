'use client';

import { useState, useEffect } from 'react';
import { expensesService } from '@/services';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, QueryParams } from '@/types/api';

function normalizeExpensesResponse(response: any): {
  items: Expense[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
} {
  if (Array.isArray(response)) {
    return {
      items: response,
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: response.length,
        total: response.length,
      },
    };
  }

  const items = Array.isArray(response?.data) ? response.data : [];
  return {
    items,
    pagination: {
      currentPage: response?.current_page ?? 1,
      lastPage: response?.last_page ?? 1,
      perPage: response?.per_page ?? items.length,
      total: response?.total ?? items.length,
    },
  };
}

export function useExpenses(autoFetch = true) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  useEffect(() => {
    if (autoFetch) {
      fetchExpenses();
    }
  }, [autoFetch]);

  const fetchExpenses = async (params?: QueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expensesService.getAll(params);
      const normalized = normalizeExpensesResponse(response);
      setExpenses(normalized.items);
      setPagination(normalized.pagination);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar despesas');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyExpenses = async (params?: QueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expensesService.getMyExpenses(params);
      const normalized = normalizeExpensesResponse(response);
      setExpenses(normalized.items);
      setPagination(normalized.pagination);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar despesas');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const getExpense = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const expense = await expensesService.getById(id);
      return expense;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (data: CreateExpenseRequest, file?: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = file
        ? await expensesService.createWithFile(data, file)
        : await expensesService.create(data);
      await fetchExpenses();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createExpenseAsDriver = async (data: CreateExpenseRequest, file?: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = file
        ? await expensesService.createWithFile(data, file)
        : await expensesService.createAsDriver(data);
      await fetchMyExpenses();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: number, data: UpdateExpenseRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expensesService.update(id, data);
      await fetchExpenses();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await expensesService.delete(id);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveExpense = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await expensesService.approve(id);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Erro ao aprovar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectExpense = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await expensesService.reject(id);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'Erro ao rejeitar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyTotal = async () => {
    setLoading(true);
    setError(null);
    try {
      const total = await expensesService.getMyMonthlyTotal();
      return total;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar total mensal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    loading,
    error,
    pagination,
    fetchExpenses,
    fetchMyExpenses,
    getExpense,
    createExpense,
    createExpenseAsDriver,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    getMonthlyTotal,
  };
}
