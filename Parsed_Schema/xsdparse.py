# -*- coding: utf-8 -*-
'''
XML parser.  
Uses simple string indexing but works??
Author: nigel@notbinary.co.uk
Created: 31 January 2019


Need to create rules such that a restriction is expected after a simple type. 
If the restriction is integer, then should be followed by maxInclusive and minInclusive
If the restriction is string, then it should be followed by s number of enumeration values, 
annotations, and documentation.  
Both of these types need to be packaged up. 
Need to consider the closing statement.
'''

def parse_simpleType(line):
	# get the name of the simmple variable
	loc = line.find('name')
	name = line[loc+6:]
	name = name[:-3]
	print(name)
	return name

def parse_complexType(line):
    # get the name of the simmple variable
    loc = line.find('name')
    name = line[loc+6:]
    name = name[:-2]
    print(name)
    return name


def parse_restriction(line):
    # get the variable type
    loc = line.find('base')
    dtype = line[loc+9:]
    dtype = dtype[:-3]
    print(dtype)
    return dtype

def parse_enumeration(line):
	# get the enumeration value and matching label
	loc = line.find('value')
	value = line[loc+7:]
	value = value[:-3]
	return value

def parse_documentation(line):
    # get the labels for enumeration
    print('xx'+line)
    loc = line.find('doc')
    doc = line[loc+14:]
    loc = doc.find('</')
    doc = doc[:loc]
    print(doc)
    return doc

def parse_mininc(line):
	# get the max and min values (depending on input)
	loc = line.find('value')
	value = line[loc+7:]
	value = value[:-4]
	return value
        
def parse_element(line, xsd):
    elements = {}
    print('in function')
    text = ''
    elements['element'] = line[line.find('name')+6:line.find('"')]
    for line in xsd:
        if line[6:8] == 'all':
            for line in xsd:
                ele = []
                if line[15:20] == 'name':
                    ele.append(line[line.find('name')+6:line.find('"')])
                    i += 1
            element = line[line.find('name')+6:line.find('"')]
            if element in ele:
                seqlist = []
                for line in xsd:
                    if line[7:14] == 'element':
                        name = line[line.find('name')+6:line.find('"')]
                        if line.find('maxOccurs') > 0:
                            maxoc = line[line.find('maxOccurs')+11:-3]
                        if line.find('minOccurs') > 0:
                        	minoc = line[line.find('minOccurs')+11:-3]
                        if line.find('boolean') > 0:
                        	boole = True
                        x = name + ', ' 
                        if len(maxoc) > 0:
                        	x = x + maxoc + ', '
                        if len(minoc) > 0:
                        	x = x + minoc + ', '
                        if boole:
                        	x = x + 'boolean'
                        x = x + '\n'
                        text = text + x
                        print('text; ', text)

    return text    			

def parse_compElement(line):
    loc = line.find('"')
    name = line[loc+1:]
    loc = name.find('"')
    name = name[:loc]
    maxoc = ''
    minoc = ''
    money = ''
    if line.find('maxOccurs') > 0:
        maxoc = line[line.find('maxOccurs')+11:-3]
    if line.find('minOccurs') > 0:
        minoc = line[line.find('minOccurs')+11:-3]     
    if line.find('Money') > 0:
        money = 'Money'
    x = '\t' + name + ', ' + maxoc +', ' + minoc + ', ' + money + '\n'
    return x


def parse_xsd(fname):
    xsd = open(fname)
    x = ''
    num = 0
    package = {}
    out = open('parsed.txt', 'w')
    for line in xsd:
        if line[5:11] == 'simple':
            print('simple!!')
            package['simple'] = parse_simpleType(line)
            print(str(package))
        if line[5:12] == 'element':
            print('element!!')
            # do the loopy element thing
            elements = {}
            text = ''
            elements['element'] = line[line.find('name')+6:line.find('"')]
            print(elements)
        if line[6:14] == 'sequence':
            elements['sequence'] = True
        if line[7:14] == 'element':
            x = parse_compElement(line)
            out.write(x)
        if line[5:11] == 'complex':
            comp = parse_complexType(line)
            out.write(comp+'\n')
        if line[6:17] == 'restriction': 
            package['restriction'] = parse_restriction(line)
        if line[7:18] == 'enumeration':
            num += 1
            nfield = 'enumeration' + str(num)
            package[nfield] = str(parse_enumeration(line))
        if line[9:22] == 'documentation':
            dfield = 'documentation' + str(num)
            package[dfield] = parse_documentation(line)
        if line[7:13] == 'minInc':
            package['minInclusive'] = str(parse_mininc(line))
        if line[7:13] == 'maxInc':
            package['maxInclusive'] = str(parse_mininc(line))
        print(line)
        if line[2] == '/' and line.find('simple') > 0:
            x = package['simple'] + ', ' + package['restriction'] + ', '
            if package['restriction'] == 'integer':
                print(str(package))
                if 'maxInclusive' in package:
                    x = x + 'Max: ' + package['maxInclusive'] + ', '
                if 'minInclusive' in package:
                    x = x + 'Min: ' + package['minInclusive'] + '\n'
                print('x string: ', x)
                out.write(x)
                package = {}
            elif package['restriction']	== 'string':
                print(str(package))
                print('num :', num)
                i = 1
                while i <= num:
                    nfield = 'enumeration' + str(i)
                    dfield = 'documentation' + str(i)
                    x = x + package[nfield] + ', '
                    x = x + package[dfield] + ', '
                    i += 1
                x = x + '\n'
                num = 0
                print('x string: ', x)
                out.write(x)
                package = {}
        if line[2] == '/' and line.find('complex') > 0:
            if 'element' in package:
                x = package['element']
                out.write(x)
                package = {}
    print('all done')

if __name__ == '__main__':
    fname = input('Enter name of schema file....')
    parse_xsd(fname)