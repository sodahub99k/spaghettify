
#include <stdio.h>
  void   

  bubbleSort(int array[], int  array_size){int    i,j
        , 
 k;for  (i   =  0; i<( array_size
-  1)
       ;i
  ++ ){ for  (j=(array_size- 1 )
;j
        >i;j--){   if(array   [j ]<array [j -1 ]        ) {k =
        array [   j ];array [ j]= array[ j-1] ; array    [ j-1   ]=k  ; }}}}int main(
    void)  {  int i  ;     int array[10 ]={3,  6, 1,7,2 , 0 ,4,
                 
        5, 9 ,8 }  ; printf(
        "       array: ")   ;
           for
      ( 
        i = 0;
     i  <sizeof(  array)/  sizeof(array 
   [0]);    i ++
 ) {printf("%d "
,array [i   ]  );}printf ("\n") ; bubbleSort(array  ,
sizeof (array )/sizeof(array[0     
 ] ));printf ("sorted array: ")    ; for( i    = 0;  i<sizeof(array )/  sizeof (
        
            array[0])     ; 
              i++)  { printf  (  "%d ",array[i])   ;}printf
          (  "\n" );return 0 ; 
           }