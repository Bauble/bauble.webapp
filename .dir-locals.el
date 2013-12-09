;;; Directory Local Variables
;;; See Info node `(emacs) Directory Variables' for more information.

((js-mode
  (js-indent-level . 4)
  (eval setq flycheck-flake8rc
        (expand-file-name ".jshintrc"
                          (projectile-project-root)))))




