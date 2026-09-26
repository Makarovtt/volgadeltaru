<?php

ini_set('max_execution_time', 3600);

require_once("vendor/autoload.php");

function print_arr($arr) {
    echo '<pre>' . print_r($arr, true) . '</pre>';
}

class Parser
{
    /**
     * @var array
     */
    private static $arErrorCodes = [
        "CURLE_UNSUPPORTED_PROTOCOL",
        "CURLE_FAILED_INIT",
        "CURLE_URL_MALFORMAT",
        "CURLE_URL_MALFORMAT_USER",
        "CURLE_COULDNT_RESOLVE_PROXY",
        "CURLE_COULDNT_RESOLVE_HOST",
        "CURLE_COULDNT_CONNECT",
        "CURLE_FTP_WEIRD_SERVER_REPLY",
        "CURLE_REMOTE_ACCESS_DENIED",
        "CURLE_FTP_WEIRD_PASS_REPLY",
        "CURLE_FTP_WEIRD_PASV_REPLY",
        "CURLE_FTP_WEIRD_227_FORMAT",
        "CURLE_FTP_CANT_GET_HOST",
        "CURLE_FTP_COULDNT_SET_TYPE",
        "CURLE_PARTIAL_FILE",
        "CURLE_FTP_COULDNT_RETR_FILE",
        "CURLE_QUOTE_ERROR",
        "CURLE_HTTP_RETURNED_ERROR",
        "CURLE_WRITE_ERROR",
        "CURLE_UPLOAD_FAILED",
        "CURLE_READ_ERROR",
        "CURLE_OUT_OF_MEMORY",
        "CURLE_OPERATION_TIMEDOUT",
        "CURLE_FTP_PORT_FAILED",
        "CURLE_FTP_COULDNT_USE_REST",
        "CURLE_RANGE_ERROR",
        "CURLE_HTTP_POST_ERROR",
        "CURLE_SSL_CONNECT_ERROR",
        "CURLE_BAD_DOWNLOAD_RESUME",
        "CURLE_FILE_COULDNT_READ_FILE",
        "CURLE_LDAP_CANNOT_BIND",
        "CURLE_LDAP_SEARCH_FAILED",
        "CURLE_FUNCTION_NOT_FOUND",
        "CURLE_ABORTED_BY_CALLBACK",
        "CURLE_BAD_FUNCTION_ARGUMENT",
        "CURLE_INTERFACE_FAILED",
        "CURLE_TOO_MANY_REDIRECTS",
        "CURLE_UNKNOWN_TELNET_OPTION",
        "CURLE_TELNET_OPTION_SYNTAX",
        "CURLE_PEER_FAILED_VERIFICATION",
        "CURLE_GOT_NOTHING",
        "CURLE_SSL_ENGINE_NOTFOUND",
        "CURLE_SSL_ENGINE_SETFAILED",
        "CURLE_SEND_ERROR",
        "CURLE_RECV_ERROR",
        "CURLE_SSL_CERTPROBLEM",
        "CURLE_SSL_CIPHER",
        "CURLE_SSL_CACERT",
        "CURLE_BAD_CONTENT_ENCODING",
        "CURLE_LDAP_INVALID_URL",
        "CURLE_FILESIZE_EXCEEDED",
        "CURLE_USE_SSL_FAILED",
        "CURLE_SEND_FAIL_REWIND",
        "CURLE_SSL_ENGINE_INITFAILED",
        "CURLE_LOGIN_DENIED",
        "CURLE_TFTP_NOTFOUND",
        "CURLE_TFTP_PERM",
        "CURLE_REMOTE_DISK_FULL",
        "CURLE_TFTP_ILLEGAL",
        "CURLE_TFTP_UNKNOWNID",
        "CURLE_REMOTE_FILE_EXISTS",
        "CURLE_TFTP_NOSUCHUSER",
        "CURLE_CONV_FAILED",
        "CURLE_CONV_REQD",
        "CURLE_SSL_CACERT_BADFILE",
        "CURLE_REMOTE_FILE_NOT_FOUND",
        "CURLE_SSH",
        "CURLE_SSL_SHUTDOWN_FAILED",
        "CURLE_AGAIN",
        "CURLE_SSL_CRL_BADFILE",
        "CURLE_SSL_ISSUER_ERROR",
        "CURLE_FTP_PRET_FAILED",
        "CURLE_FTP_PRET_FAILED",
        "CURLE_RTSP_CSEQ_ERROR",
        "CURLE_RTSP_SESSION_ERROR",
        "CURLE_FTP_BAD_FILE_LIST",
        "CURLE_CHUNK_FAILED"
    ];

    /**
     * @param array $arParams
     * @return array|bool
     */
    public static function getPage($arParams = [])
    {
        if ($arParams) {
            if (!empty($arParams["url"])) {
                $sUrl = $arParams["url"];
                $sUserAgent = !empty($arParams["useragent"]) ? $arParams["useragent"] : "Mozilla/5.0 (Windows NT 6.3; W…) Gecko/20100101 Firefox/57.0";
                $iTimeout = !empty($arParams["timeout"]) ? $arParams["timeout"] : 5;
                $iConnectTimeout = !empty($arParams["connecttimeout"]) ? $arParams["connecttimeout"] : 5;
                $bHead = !empty($arParams["head"]) ? $arParams["head"] : false;
                $sCookieFile = !empty($arParams["cookie"]["file"]) ? $arParams["cookie"]["file"] : false;
                $bCookieSession = !empty($arParams["cookie"]["session"]) ? $arParams["cookie"]["session"] : false;
                $sProxyIp = !empty($arParams["proxy"]["ip"]) ? $arParams["proxy"]["ip"] : false;
                $iProxyPort = !empty($arParams["proxy"]["port"]) ? $arParams["proxy"]["port"] : false;
                $sProxyType = !empty($arParams["proxy"]["type"]) ? $arParams["proxy"]["type"] : false;
                $arHeaders = !empty($arParams["headers"]) ? $arParams["headers"] : false;
                $sPost = !empty($arParams["post"]) ? $arParams["post"] : false;

                if ($sCookieFile) {
                    file_put_contents(__DIR__ . "/" . $sCookieFile, "");
                }

                $rCh = curl_init();
                curl_setopt($rCh, CURLOPT_URL, $sUrl);
                curl_setopt($rCh, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($rCh, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($rCh, CURLOPT_USERAGENT, $sUserAgent);
                curl_setopt($rCh, CURLOPT_TIMEOUT, $iTimeout);
                curl_setopt($rCh, CURLOPT_CONNECTTIMEOUT, $iConnectTimeout);

                if ($bHead) {
                    curl_setopt($rCh, CURLOPT_HEADER, true);
                    curl_setopt($rCh, CURLOPT_NOBODY, true);
                }

                if (strpos($sUrl, "https") !== false) {
                    curl_setopt($rCh, CURLOPT_SSL_VERIFYHOST, false);
                    curl_setopt($rCh, CURLOPT_SSL_VERIFYPEER, false);
                }

                if ($sCookieFile) {
                    curl_setopt($rCh, CURLOPT_COOKIEJAR, __DIR__ . "/" . $sCookieFile);
                    curl_setopt($rCh, CURLOPT_COOKIEFILE, __DIR__ . "/" . $sCookieFile);

                    if ($bCookieSession) {
                        curl_setopt($rCh, CURLOPT_COOKIESESSION, true);
                    }
                }

                if ($sProxyIp && $iProxyPort && $sProxyType) {
                    curl_setopt($rCh, CURLOPT_PROXY, $sProxyIp . ":" . $iProxyPort);
                    curl_setopt($rCh, CURLOPT_PROXYTYPE, $sProxyType);
                }

                if ($arHeaders) {
                    curl_setopt($rCh, CURLOPT_HTTPHEADER, $arHeaders);
                }

                if ($sPost) {
                    curl_setopt($rCh, CURLOPT_POSTFIELDS, $sPost);
                }

                curl_setopt($rCh, CURLINFO_HEADER_OUT, true);

                $sContent = curl_exec($rCh);
                $arInfo = curl_getinfo($rCh);

                $arError = false;

                if ($sContent === false) {
                    $arData = false;

                    $arError["message"] = curl_error($rCh);
                    $arError["code"] = self::$arErrorCodes[curl_errno($rCh)];
                } else {
                    $arData["content"] = $sContent;
                    $arData["info"] = $arInfo;
                }

                curl_close($rCh);

                return [
                    "data" => $arData,
                    "error" => $arError
                ];
            }
        }

        return false;
    }
}


function parser($i, $table, $cat_parent) {

    $url = 'https://www.vamsvet.ru/catalog/section/bra-i-podsvetki/?catalog_ajax_call=Y&PAGEN_1='.$i;

    $html = Parser::getPage([
        "url" => $url // string Ссылка на страницу
    ]); 
    print_arr($html);
    $content = $html["data"]["content"];
    
    $content = json_decode($content,true);
    foreach($content as $item) {
        $doc2 = $item;
    }
         
    $doc = phpQuery::newDocument($doc2);

    $insert = '';

    $block_items = $doc->find('.prod__list .prod__el');
                
    foreach($block_items as $item) {
        $title='';$href='';$price_now=0;$sale=0;
                
        $item = pq($item);
        // $title = $item->find('.prod__name-wr a')->text();
        $title = $item->find('.btn-sravn')->attr('data-name');
        
        $href = $item->find('.prod__name-wr a')->attr('href');
        $href = 'https://www.vamsvet.ru'.$href;
        
        $price_now = $item->find('.prod__price-cur')->text();
        if(!empty($price_now)) {
            $price_now = intval(preg_replace('/[^0-9]+/', '', $price_now), 10);
            $price_now = str_replace(" ", "", $price_now);
        } else {
            $price_now = 0;
        }
        
        $price_old = $item->find('.prod__price-old span')->text();
        if(!empty($price_old)) {
            $arr_price_old = explode('₽', $price_old);
            $price_old = $arr_price_old[0];
            $price_old = intval(preg_replace('/[^0-9]+/', '', $price_old), 10);
            $price_old = str_replace(" ", "", $price_old);
            $sale=1;
            $new_price = $price_now;
            $price_now = $price_old;
        } else {
            $price_old=0;
        }
                
           $balance = $item->find('.prod__avail span')->text();
           if(empty($balance)) { $balance = 0; }
                
        $blocks_image = $item->find('.prod__imges img');
            
        $arr_src = '';
        $picture = '';
        $i_img = 1;
        foreach($blocks_image as $block) {
            $block = pq($block);
            $src = $block->attr('src');
            $src = 'https://www.vamsvet.ru'.$src;
            $arr_src = $arr_src.$src.";";
            if($i_img == 1) {
                $picture = $src;
            }
            $i_img++;
        }
        if($arr_src != '') {
            $arr_src = substr_replace($arr_src,'',-1);
        }
                
                //$insert_part = get_data_product($href);
                
        $insert .= "('','','','".$picture."','".$title."','','','".$href."','',0,'','".$arr_src."',
                '','','".$price_now."',0,0,'','".$balance."','','".$cat_parent."'),";

    }
    $insert = substr($insert,0,-1);
    echo $price_now."-".$price_old."-".$sale;
            
    phpQuery::unloadDocuments();

}


    
    $start = 1;
    $end = 2; //
   
    $table_vam_svet = 'bra-i-podsvetki';
    $cat_parent = 'elektrotovary';
    $table_arthouse = 'light_bd_'.$cat_parent;
    

    
    
  
    
    for($i=$start; $i<$end; $i++) {
        $insert = parser($i, $table_vam_svet, $cat_parent);
        
    }
?>
