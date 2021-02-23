/*************
 ANO grammar
 **
 */

grammar Ano;

model:
	table* fk* conversion* transformation* distribution* randomType* sql taskGroup* EOF;

table: 'table' tableid column* pk? unique*;

column: 'column' datatype columnid precision?;
datatype: NAME_CHARS;
precision: numsize scale?;
numsize: 'size' posint;
scale: 'scale' posint;
pk: 'primary-key' columns;
unique: 'unique' columnid columns;
fk: 'foreign-key' fkCols fkCols setNull?;

fkCols: tableid columns;

columns: columnid (',' columnid)*;

// Dynamically added: decimal, date, datetime, time, integer
randomType: id;

// Dynamically added: String2Date, String2decimal
conversion: 'conversion' namespace;

// Dynamically added: Email, CreditCard
transformation: 'transformation' namespace;

// Dynamically added: AllCombinations
distribution: 'distribution' namespace;

workTask: (update | create | delete | erase | sar);

sql:
	('sql-before' sqlbefore = id)? ('sql-after' sqlafter = id)?;

taskGroup: 'task' taskid sql '{' (taskGroup | workTask)* '}';

update:
	'update' tableid taskid? sql selectionKey? where? anonymization*;

selectionKey: 'selection-key' columnid;

anonymization:
	(mask | randomize | shuffle) map? tempKey? propagate?;

propagate: 'propagate' propagateColumn (',' propagateColumn)*;

propagateColumn: tableid '.' columnid;

tempKey: 'temporary-value' textin;

mask:
	'mask' anoColumn taskid? format? transform? uniqueMask? source*;

uniqueMask: 'unique';

anoColumn: columnid;

format: 'format' textin;

transform: 'transform' transformprog;
transformprog: NAME_CHARS;

convert: 'convert' convertprog;
convertprog: NAME_CHARS;

source:
	sourceColumn
	| sourceFile
	| sourceRandom
	| sourceSequence;

sourceColumn: 'column' anoColumn convert?;

sourceSequence: 'sequence' begin = integer increment = integer;

sourceFile: 'file' filename 'random-order'? convert?;

sourceRandom:
	randomInteger
	| randomDecimal
	| randomTime
	| randomDate
	| randomdatetime;

randomInteger: 'random-integer' from = integer to = integer;

randomDecimal: 'random-decimal' from = decimal to = decimal;

randomTime: 'random-time' from = time to = time;

randomDate: 'random-date' from = date to = date;

randomdatetime: 'random-datetime' from = datetime to = datetime;

randomize:
	'randomize' anoColumn taskid? 'type' randomType (
		format? convert? transform? uniqueMask? offset? flatNoise? percentageNoise?
	);

offset: 'offset' decimal;

flatNoise: 'flat-noise' decimal;

percentageNoise: 'percentage-noise' decimal;

shuffle: 'shuffle' anoColumn taskid?;

map: 'map' filename mapUsage 'encrypted'?;

mapUsage: ('input' | 'output' | 'input-output');

create:
	'create' tableid taskid? sql selectionKey? minRows? anonymization* distribute*;

distribute: 'distribute' distribution textin? createTable*;

createTable:
	'table' tableid textin? createChildColumns createParentColumns;

createChildColumns: 'child' columns;

createParentColumns: 'parent' columns;

minRows: 'minimum-rows' posint;

where: 'where' id;

delete:
	'delete' tableid taskid? sql selectionKey? where? (
		'method' method
	)? ('{' deleteTable+ '}')?;

method: 'cascading' | 'not-in' | 'not-exists';

deleteTable:
	'cascade' tableid parentCols childCols (
		('{' deleteTable+ '}')
		| setNull
	)?;

childCols: 'child' columns;

parentCols: 'parent' columns;

setNull: 'setnull';

erase:
	'erase' tableid taskid? sql selectionKey? where? maskColumn* (
		'{' eraseTable+ '}'
	)? setNull?;

eraseTable:
	'cascade' tableid parentCols childCols maskColumn* (
		'{' eraseTable+ '}'
	)? setNull?;

sar:
	'sar' tableid taskid? sql selectionKey? where? maskColumn* (
		'{' sarTable+ '}'
	)?;

sarTable:
	'cascade' tableid parentCols childCols maskColumn* (
		'{' sarTable+ '}'
	)?;

maskColumn: 'mask' columnid format? transform?;

columnid: id;
tableid: id;

datetime: date time?;
time: TIMEFMT;
date: DATEFMT;
filename: param;
textin: param;
integer: numeric;
posint: numeric;
decimal: numeric;
taskid: id;
namespace: id ('.' (id))*;
param: (numeric | id | '.' | ANY_OTHER)+;
id: name | STRING;
name: NAME_CHARS (NAME_CHARS | DIGITS)*;
numeric: '-'? DIGITS ('.' DIGITS)?;

/*
 LEXER rules:
 are directly tokenized
 fragments can only be used from LEXER rules.
 */
TIMEFMT: DIGIT DIGIT ':' DIGIT DIGIT ':' DIGIT DIGIT;
DATEFMT:
	DIGIT DIGIT DIGIT DIGIT '-' DIGIT DIGIT '-' DIGIT DIGIT;
STRING: ('"' ( ESCAPED_CHAR | ~('\\' | '"'))* '"');

ML_COMMENT: '/*' .*? '*/' -> channel(HIDDEN);
SL_COMMENT: '//' .*? '\n' -> channel(HIDDEN);

NAME_CHARS: NAME_CHAR+;
DIGITS: DIGIT+;
WS: WS_CHAR+ -> skip;
ESCAPED_CHAR: '\\' ('n' | 't' | 'r' | '"' | '\\');
fragment DIGIT: [0-9];
fragment NEWLINE: '\n';
fragment NAME_CHAR: [a-zA-Z_];
fragment WS_CHAR: [ \t\r\n];
ANY_OTHER: .;

