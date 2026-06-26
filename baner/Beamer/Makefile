MAIN	= Aula-03.tex
BIBLIO	= Referencias


all: PDF Again


PDF: ${MAIN}.pdf
${MAIN}.pdf : ${SOURCES} 
	pdflatex ${MAIN}
	bibtex   ${BIBLIO}		
	pdflatex ${MAIN}
	pdflatex ${MAIN}
	sumatraPDF $(MAIN).pdf



clean:
	del -fv *.lof *.toc *.pdf  *.ind *.ilg **.aux *.gz *.log *.xml *.bcf
	del -fv *.lot *.bbl *.pytxcode *.blg *.mlf* *.mtc* *.maf *.out *.nav *.vrb *.snm

copy:
	copy  *.tex Backup
	copy  Makefile  Backup
	copy  Brasoes\* Backup\Brasoes
	copy  Tools\*   Backup\Tools 
	copy  Figuras\* Backup\Figuras

remade:
	$(MAKE) clean
	$(MAKE) copy
	$(MAKE)