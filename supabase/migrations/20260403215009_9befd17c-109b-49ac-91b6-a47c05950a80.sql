
CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete exam results"
ON public.exam_results
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
