-- Allow admins to delete any comment
CREATE POLICY "comments_delete_admin" ON public.comments
FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Allow admins to delete any reply
CREATE POLICY "replies_delete_admin" ON public.replies
FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
