import { useToast } from '@/hooks/use-toast';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useBaseAssets, useQuoteAssets } from '@/hooks/useAssets';
import React from 'react';

// Типы для wizard состояния
interface ExchangeData {