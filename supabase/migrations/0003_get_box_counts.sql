-- 박스별 카드 수를 한 번의 호출로 조회하는 RPC 함수
-- graduated = true인 카드는 box_number = 0으로 반환
CREATE OR REPLACE FUNCTION public.get_box_counts(p_user_id uuid)
RETURNS TABLE(box_number smallint, count bigint) AS $$
  SELECT c.box_number, COUNT(*)
  FROM public.cards c
  WHERE c.user_id = p_user_id AND c.graduated = false
  GROUP BY c.box_number
  UNION ALL
  SELECT 0::smallint AS box_number, COUNT(*)
  FROM public.cards c
  WHERE c.user_id = p_user_id AND c.graduated = true
$$ LANGUAGE sql STABLE SECURITY DEFINER;
