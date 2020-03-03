from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from pyecharts import options as opts
from pyecharts.charts import Map
import requests
import re
import json
from django.views.decorators.csrf import csrf_exempt
dict={'beijing':'北京市','tianjin':'天津市','shanghai':'上海市','chongqing':'重庆市','hebei':'河北省','shanxi1':'山西省','liaoning':'辽宁省','jilin':'吉林省','heilongjiang':'黑龙江省','jiangsu':'江苏省','zhejiang':'浙江省','anhui':'安徽省','fujian':'福建省','jiangxi':'江西省','shandong':'山东省','henan':'河南省','hubei':'湖北省','hunan':'湖南省','guangdong':'广东省','hainan':'海南省','sichuan':'四川省','guizhou':'贵州省','yunnan':'云南省','shanxi':'陕西省','gansu':'甘肃省','qinghai':'青海省','taiwan':'台湾','neimeng':'内蒙古自治区','guangxi':'广西壮族自治区','xizang':'西藏自治区','ningxia':'宁夏回族自治区', 'xinjiang':'新疆维吾尔自治区','xianggang':'香港','aomen':'澳门'}
dict1={'beijing':'北京','tianjin':'天津','shanghai':'上海','chongqing':'重庆','hebei':'河北','shanxi1':'山西','liaoning':'辽宁','jilin':'吉林','heilongjiang':'黑龙江','jiangsu':'江苏','zhejiang':'浙江','anhui':'安徽','fujian':'福建','jiangxi':'江西','shandong':'山东','henan':'河南','hubei':'湖北','hunan':'湖南','guangdong':'广东','hainan':'海南','sichuan':'四川','guizhou':'贵州','yunnan':'云南','shanxi':'陕西','gansu':'甘肃','qinghai':'青海','taiwan':'台湾','neimeng':'内蒙古','guangxi':'广西','xizang':'西藏','ningxia':'宁夏', 'xinjiang':'新疆','xianggang':'香港','aomen':'澳门'}
jsonurl={
'beijing' : 'https://file1.dxycdn.com/2020/0223/004/3398299758115524169-135.json',
'shanghai' : 'https://file1.dxycdn.com/2020/0223/128/3398299755968454977-135.json',
'tianjin' : 'https://file1.dxycdn.com/2020/0223/669/3398299753820555949-135.json',
'chongqing' : 'https://file1.dxycdn.com/2020/0223/368/3398299751673487486-135.json',
'hebei' :  'https://file1.dxycdn.com/2020/0223/473/3398299751673487477-135.json',
'shanxi' : 'https://file1.dxycdn.com/2020/0223/857/3398299753820971228-135.json',
'liaoning':'https://file1.dxycdn.com/2020/0223/815/3398299758115938736-135.json',
'jilin' : 'https://file1.dxycdn.com/2020/0223/046/3398299755968039975-135.json',
'heilongjiang' : 'https://file1.dxycdn.com/2020/0223/643/3398299753820971199-135.json',
'jiangsu' : 'https://file1.dxycdn.com/2020/0223/111/3398299753820971290-135.json',
'zhejiang' : 'https://file1.dxycdn.com/2020/0223/537/3398299755968455045-135.json',
'anhui' : 'https://file1.dxycdn.com/2020/0223/734/3398299753820971301-135.json',
'fujian' : 'https://file1.dxycdn.com/2020/0223/744/3398299751673071813-135.json',
'jiangxi' : 'https://file1.dxycdn.com/2020/0223/161/3398299751673072165-135.json',
'shandong' : 'https://file1.dxycdn.com/2020/0223/601/3398299749526003726-135.json',
'henan' : 'https://file1.dxycdn.com/2020/0223/958/3398299751673487456-135.json',
'hubei' :'https://file1.dxycdn.com/2020/0223/618/3398299751673487511-135.json',
'hunan' : 'https://file1.dxycdn.com/2020/0223/440/3398299751673072079-135.json',
'guangdong' : 'https://file1.dxycdn.com/2020/0223/281/3398299758115524068-135.json',
'hainan' : 'https://file1.dxycdn.com/2020/0223/126/3398299753820555862-135.json',
'sichuan' : 'https://file1.dxycdn.com/2020/0223/926/3398299755968455035-135.json',
'guizhou' : 'https://file1.dxycdn.com/2020/0223/148/3398299753820971243-135.json',
'yunnan' :  'https://file1.dxycdn.com/2020/0223/159/3398299758115523929-135.json',
'shanxi1' : 'https://file1.dxycdn.com/2020/0223/196/3398299755968040081-135.json',
'gansu' : 'https://file1.dxycdn.com/2020/0223/559/3398299755968040166-135.json',
'qinghai' : 'https://file1.dxycdn.com/2020/0223/581/3398299758115524121-135.json',
'taiwan' : 'https://file1.dxycdn.com/2020/0223/045/3398299749526003760-135.json',
'xianggang' : 'https://file1.dxycdn.com/2020/0223/331/3398299755968040033-135.json',
'aomen' : 'https://file1.dxycdn.com/2020/0223/840/3398299753820971267-135.json',
'neimeng' : 'https://file1.dxycdn.com/2020/0223/783/3398299758115938727-135.json',
'guangxi' : 'https://file1.dxycdn.com/2020/0223/536/3398299758115523880-135.json',
'xizang' : 'https://file1.dxycdn.com/2020/0223/353/3398299755968039885-135.json',
'ningxia' : 'https://file1.dxycdn.com/2020/0223/353/3398299755968455019-135.json',
'xinjiang' :  'https://file1.dxycdn.com/2020/0223/497/3398299753820556085-135.json',
}
def getepodemicdata():
    """
    爬虫获取数据

    :return: html
    """
    s = requests.session()
    url = "https://3g.dxy.cn/newh5/view/pneumonia"
    response = s.get(url)
    response.encoding = 'utf-8'
    html = response.text
    return html

def drawmap():
    '''
    获得各省内各市的疫情数据，由于Echarts和pyechart传入的地市名成不一致，Echarts传入的是市名比如：‘郑州’，而pyecharts传入的为‘郑州市’所以地图名不用再做之前的处理。
    :return: 各市级数据
    '''
    get_all_city_map_data={}

    html =  getepodemicdata()
    for province in list(dict.keys()):
        city_data=[]
        city_name = []
        if dict[province] != '西藏自治区':
            regular = '(\{\\\"provinceName"\:\\\"' + dict[province] + '\\\"\,\\\"provinceShortName\\\".+?\{\\\"provinceName\\\")'
        else:
            regular = '(\{\\\"provinceName"\:\\\"' +  dict[province] + '\\\"\,\\\"provinceShortName\\\".+?\\}\\]\\}\\]\\})'
        data_json = re.findall(re.compile(regular), str(html))

        city_data = re.findall(re.compile(r'(\d+)'), str(data_json))
        city_data = city_data[12:len(city_data):6] #截取市名
        city = re.findall(re.compile(r'([\u4E00-\u9FA5]+)'), str(data_json))
        if province=='beijing'or province=='liaoning' or province=='henan' or province=='guangdong' or province=='shanxi' or province=='shanxi':
            city_name=city[5:len(city)]
        elif province=='shanghai'or province=='gansu':
            city_name = city[6:len(city)]
        elif province=='tianjin' or province=='chongqing' or province=='hebei' or province =='shanxi1' or province=='jilin' or province=='heilongjiang' or province=='jiangsu' or province=='zhejiang' or province=='anhui' or province=='jiangxi' or province=='shandong' or province=='hubei' or province=='hunan' or province=='hainan' or province=='sichuan' or province=='guizhou' or province=='yunan'  or province=='qinghai' or province=='neimeng' or province=='guangxi' or province=='xizang' or province=='ningxia' or province=='xinjiang':
            city_name = city[2:len(city)]
        get_city_map_data=[]
        for i in range(len(city_name)):
            map_chart_dict = {}
            try:
                map_chart_dict['name'] = city_name[i]
                map_chart_dict['value'] = city_data[i]
                get_city_map_data.append(map_chart_dict)
            except:
                print(city_data,city_name)
        get_all_city_map_data[dict1[province]]=get_city_map_data
    return get_all_city_map_data

def drewi():
    '''
    获得全国各省数据
    :return: 各省数据
    '''
    html = getepodemicdata()
    city_data1 = []
    city_name=[]
    for value in dict.values():
        if value != '西藏自治区':
            regular = '(\{\\\"provinceName"\:\\\"' + value + '\\\"\,\\\"provinceShortName\\\".+?\{\\\"provinceName\\\")'
        else:
            regular = '(\{\\\"provinceName"\:\\\"' + value + '\\\"\,\\\"provinceShortName\\\".+?\\}\\]\\}\\]\\})'
        data_json = re.findall(re.compile(regular), str(html))
        city_data = re.findall(re.compile(r'(\d+)'), str(data_json))
        city_data1.append(city_data[0])
    map_chart_list = []
    for i in range(len(dict1.values())):
        map_chart_dict = {}
        map_chart_dict['name'] = list(dict1.values())[i]
        map_chart_dict['value'] = city_data1[i]
        map_chart_list.append(map_chart_dict)
    return map_chart_list

# Create your views here.

def index(request):
    return render(request,'templates_map/bigdata.html')

def get_map_data(request):
    map_data = drewi()
    city_data = drawmap()
    country_every_data=get_chart4_data()
    return JsonResponse({'country': map_data, 'city': city_data,'country_every_data':country_every_data})
def get_ncov_totalcount(request):
    html=getepodemicdata()
    data_json = re.findall(re.compile(r'(\"countRemark\"\:\"\"\,\"currentConfirmedCount\"\:\d+\,\"confirmedCount\"\:\d+)'), str(html))
    contRemark_data = re.findall(re.compile(r'(\d+)'), str(data_json))
    return JsonResponse({'confirmedCount': contRemark_data[1], 'currentConfirmedCount': contRemark_data[0]})
def get_everyday_data(request):
    '''
    获得各省每天新增疫情和累计疫情，做趋势图用
    :param request:
    :return: JSON数据
    '''
    allcity_everyday_data={}
    for province in list(jsonurl.keys()):
        res = requests.get(jsonurl[province]).json()
        everyday_data = []
        everyday_dead=[]
        everyday_cure=[]
        everyday_add=[]
        total_data=[]
        total_dead=[]
        total_cure=[]

        one_province_data={}
        for everyday in res['data']:
            everyday_data.append(everyday['dateId'])
            everyday_dead.append(everyday['deadIncr'])
            everyday_cure.append(everyday['curedIncr'])
            everyday_add.append(everyday['confirmedIncr'])
            total_data.append(everyday['confirmedCount'])
            total_dead.append(everyday['deadCount'])
            total_cure.append(everyday['curedCount'])
            one_province_data['everyday_data']=everyday_data
            one_province_data['everyday_dead']=everyday_dead
            one_province_data['everyday_cure']=everyday_cure
            one_province_data['everyday_add']=everyday_add
            one_province_data['total_data']=total_data
            one_province_data['total_dead']=total_dead
            one_province_data['total_cure']=total_cure
        allcity_everyday_data[dict1[province]]=one_province_data
    return JsonResponse({'allcity_everyday_data':allcity_everyday_data })

def get_chart4_data():
    headers = {
        'user-agent': '',
        'accept': ''
    }
    url = 'https://c.m.163.com/ug/api/wuhan/app/data/list-total'
    trend_data = requests.get(url, headers=headers).json()
    chart4_info = {}
    chart4_date_list = []
    chart4_confirm_list = []
    chart4_heal_list = []
    chart4_dead_list = []
    chart4_today_confirm_list = []
    chart4_today_heal_list = []
    chart4_today_dead_list = []
    for data in trend_data['data']['chinaDayList']:
        chart4_date_list.append(data['date'].strip('/-').replace('-',''))
        chart4_confirm_list.append(data['total']['confirm'])
        chart4_heal_list.append(data['total']['heal'])
        chart4_dead_list.append(data['total']['dead'])
        chart4_today_confirm_list.append(data['today']['confirm'])
        chart4_today_heal_list.append(data['today']['heal'])
        chart4_today_dead_list.append(data['today']['dead'])

    chart4_info['x_name'] = chart4_date_list[-20:]
    chart4_info['confirm'] = chart4_confirm_list[-20:]
    chart4_info['heal'] = chart4_heal_list[-20:]
    chart4_info['dead'] = chart4_dead_list[-20:]
    chart4_info['today_confirm'] = chart4_today_confirm_list[-20:]
    chart4_info['today_heal'] = chart4_today_heal_list[-20:]
    chart4_info['today_dead'] = chart4_today_dead_list[-20:]

    return chart4_info